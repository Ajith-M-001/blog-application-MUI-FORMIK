import { SESSION_PREFERENCE } from "../../common/constants/constants.js";
import { COOKIE_NAME } from "../config/session.config.js";
import userModel from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler, transactionHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const registerUser = transactionHandler(
  async (req, res, next, session) => {
    const { firstName, lastName, email, password, phoneNumber, countryCode } =
      req.body;

    const queryConditions = [];

    if (email) {
      queryConditions.push({ email: email.toLowerCase() });
    }
    if (phoneNumber) {
      queryConditions.push({ phoneNumber });
    }
    // Include the session in the query for consistency
    const existingUser = await userModel
      .findOne({
        $or: queryConditions,
      })
      .session(session);

    if (existingUser) {
      const message = [];

      if (email && existingUser.email === email.toLowerCase()) {
        message.push(`User with email ${email} already exists.`);
      }

      if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
        message.push(`User with phone number ${phoneNumber} already exists.`);
      }

      // Return conflict response with 409 status code
      return res
        .status(409)
        .json(ApiResponse.error(message.join(" and "), 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with normalized email
    const newUser = new userModel({
      firstName,
      lastName,
      email: email ? email.toLowerCase() : undefined,
      phoneNumber: phoneNumber || undefined,
      countryCode,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save({ session });

    const responseObj = {
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
    };

    return res
      .status(201)
      .json(
        ApiResponse.created(
          { user: responseObj },
          "User registered successfully! please verify"
        )
      );
  }
);

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, phoneNumber } = req.body;

  const queryCondition = [];
  if (email) {
    queryCondition.push({ email: email.toLowerCase() });
  }
  if (phoneNumber) {
    queryCondition.push({ phoneNumber });
  }
  const user = await userModel
    .findOne({
      $or: queryCondition,
    })
    .select(
      "+password +failedLoginAttempts +lockUntil +sessions +accountStatus"
    );

  if (!user) {
    return res.status(404).json(ApiResponse.error("Invalid credentials", 401));
  }

  console.log("user", user);

  // Check if the account is active.
  if (user.accountStatus !== "active") {
    let message = "Account is not active";
    if (user.accountStatus === "suspended")
      message = "Account suspended. Contact support.";
    if (user.accountStatus === "inactive")
      message = "Account inactive. Please verify your email.";
    return res.status(401).json(ApiResponse.error(message, 401));
  }

  // Check if the account is locked.
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
    return res
      .status(401)
      .json(
        ApiResponse.error(
          `Account locked. Try again in ${minutesLeft} minute(s)`,
          401
        )
      );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.log("password does not match");
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
    }
    await user.save();
    return res.status(401).json(ApiResponse.error("Invalid credentials", 401));
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.lastLogin = new Date();

  const sessionMetadata = {
    sessionId: req.sessionID,
    ipAddress: req.ip,
    device: {
      browser: req.useragent.browser,
      version: req.useragent.version || "", // include version if available
      os: req.useragent.os,
      platform: req.useragent.platform,
      isMobile: req.useragent.isMobile,
      isTablet: req.useragent.isTablet,
      isDesktop: req.useragent.isDesktop,
    },
    location: {
      country: req.useragent.geoIp ? req.useragent.geoIp.country : null,
      region: req.useragent.geoIp ? req.useragent.geoIp.region : null,
      city: req.useragent.geoIp ? req.useragent.geoIp.city : null,
    },
    createdAt: Date.now(),
    lastActivity: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  };

  //store session state
  console.log("sessionMetadata", sessionMetadata);
  if (user.sessionPreference === SESSION_PREFERENCE.SINGLE) {
    user.sessions = [sessionMetadata];
  } else {
    if (user.sessions.length >= user.maxSession) {
      user.sessions.shift();
    }
    user.sessions.push(sessionMetadata);
  }

  req.session.regenerate((err) => {
    if (err) {
      return res
        .status(500)
        .json(ApiResponse.error("Failed to regenerate session", 500));
    }
  });

  await user.save();

  req.session.user = {
    _id: user._id,
  };
  req.session.lastActivity = Date.now();
  await req.session.save();

  return res
    .status(200)
    .json(
      ApiResponse.success({ userId: user._id }, "User logged in successfully")
    );
});

export const protectedRoute = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(ApiResponse.success({}, "Protected route accessed successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  await req.session.destroy();
  res.clearCookie(COOKIE_NAME); // Match your session cookie name
  res.status(200).json(ApiResponse.success(null, "Logged out successfully"));
});

export const updateSessionPreference = asyncHandler(async (req, res, next) => {
  const { sessionPreference, maxSession } = req.body;
  const currentSessionId = req.sessionID;
  console.log("sessionPreference", currentSessionId);
  const user = await userModel.findById(req.user._id).select("+sessions");
  if (!user) {
    return res.status(404).json(ApiResponse.error("User not found", 404));
  }

  if (
    user.sessionPreference === SESSION_PREFERENCE.MULTIPLE &&
    sessionPreference === SESSION_PREFERENCE.SINGLE
  ) {
    if (user.sessions.length > 1) {
      user.sessions = user.sessions.filter(
        (session) => session.sessionId === currentSessionId
      );
    }
  }

  if (
    user.sessionPreference === SESSION_PREFERENCE.SINGLE &&
    sessionPreference === SESSION_PREFERENCE.MULTIPLE
  ) {
    user.sessions = user.sessions.filter(
      (session) => session.sessionId !== currentSessionId
    );
  }

  // Update user session preference and maxSession
  user.sessionPreference = sessionPreference;
  user.maxSession =
    sessionPreference === SESSION_PREFERENCE.SINGLE ? 1 : maxSession;

  req.session.regenerate((err) => {
    if (err) {
      return res
        .status(500)
        .json(ApiResponse.error("Failed to regenerate session", 500));
    }
  });

  req.session.user = {
    _id: user._id,
  };
  await user.save();

  return res
    .status(200)
    .json(ApiResponse.success({}, "Session preference updated successfully"));
});
