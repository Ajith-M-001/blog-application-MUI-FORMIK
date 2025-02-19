import userModel from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { v4 as uuidv4 } from "uuid";
import geoip from "geoip-lite";
import bcrypt from "bcrypt";
import { SESSION_PREFERENCE } from "../../common/constants/constants.js";

export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber, countryCode } =
    req.body;
  const queryConditions = [];

  if (email) {
    queryConditions.push({ email: email.toLowerCase() });
  }

  if (phoneNumber) {
    queryConditions.push({ phoneNumber });
  }
  const existingUser = await userModel.findOne({
    $or: queryConditions,
  });

  if (existingUser) {
    const conflictMessages = [];

    if (email && existingUser.email === email.toLowerCase()) {
      conflictMessages.push(`User with email ${email} already exists.`);
    }

    if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
      conflictMessages.push(
        `User with phone number ${phoneNumber} already exists.`
      );
    }

    // Return conflict response with 409 status code
    return res
      .status(409)
      .json(ApiResponse.error(conflictMessages.join(" and "), 409));
  }

  // Create a new user instance with normalized email
  const newUser = new userModel({
    firstName,
    lastName,
    email: email ? email.toLowerCase() : undefined,
    phoneNumber: phoneNumber || undefined,
    countryCode,
    password,
  });

  // Save the new user to the database
  const savedUser = await newUser.save();

  // Convert to a plain object and remove the password field manually
  const responseObj = savedUser.toObject();
  delete responseObj.password;

  // Send a success response
  return res
    .status(201)
    .json(
      ApiResponse.created({ user: responseObj }, "User signed up successfully")
    );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, phoneNumber } = req.body;
  let user;
  if (email) {
    user = await userModel
      .findOne({ email: email.toLowerCase() })
      .select("+password +sessions"); // Added +sessions to selection
  } else {
    user = await userModel
      .findOne({ phoneNumber })
      .select("+password +sessions"); // Added +sessions to selection
  }

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("invalid credentials"));
  }

  const isPasswordMAtched = await bcrypt.compare(password, user.password);

  if (!isPasswordMAtched) {
    return res.status(404).json(ApiResponse.notFound("invalid credentials"));
  }

  // Initialize sessions array if it doesn't exist
  if (!user.sessions) {
    user.sessions = [];
  }

  const sessionData = {
    sessionId: uuidv4(),
    deviceInfo: {
      os: req.useragent.os,
      browser: req.useragent.browser,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      lastLocation: geoip.lookup(req.ip)?.country || "Unknown",
    },
    loggedInAt: new Date(),
    lastActive: new Date(),
    isValid: true,
  };

  // Check session preference and manage sessions accordingly
  if (user.sessionPreference === SESSION_PREFERENCE.SINGLE) {
    // Invalidate all existing sessions
    user.sessions.forEach((session) => {
      session.isValid = false;
    });
    user.sessions = [sessionData];
  } else {
    // Handle multiple sessions
    if (user.sessions.length >= user.maxSession) {
      // Remove oldest session
      user.sessions.shift();
    }
    user.sessions.push(sessionData);
  }

  await user.save();

  req.session.sessionId = sessionData.sessionId;
  req.session.userId = user._id;

  const responseObj = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: user.roles,
  };
  res.status(200).json(ApiResponse.success("login successful", responseObj));
});

export const logout = asyncHandler(async (req, res, next) => {
  if (req.user && req.user._id) {
    const user = await userModel.findById(req.user._id).select("+sessions");

    if (!user) {
      return res.status(404).json(ApiResponse.notFound("User not found"));
    }

    if (req.body.clearAllSessions) {
      user.sessions = [];
    } else {
      user.sessions.pull({ sessionId: req.session.sessionId });
    }

    await user.save();

    // Destroy the session on the server
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Error logging out" });
      }

      // Clear the session cookie on the client
      res.clearCookie("blog.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "strict", // Adjust as needed
      });

      // Send a success response
      return res
        .status(200)
        .json(ApiResponse.success("Signed out successfully"));
    });
  } else {
    return res.status(400).json(ApiResponse.error("No user logged in"));
  }
});
