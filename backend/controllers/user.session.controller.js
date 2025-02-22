import { COOKIE_NAME } from "../config/session.config.js";
import userModel from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler, transactionHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt";

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
    .select("+password");

  if (!user) {
    return res.status(404).json(ApiResponse.error("Invalid credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json(ApiResponse.error("Invalid credentials", 401));
  }

  //store session state

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
  req.session.lastActivity = Date.now();
  await req.session.save();

  const responseObj = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: user.roles,
    phoneNumber: user.phoneNumber,
    countryCode: user.countryCode,
  };

  return res
    .status(200)
    .json(
      ApiResponse.success({ user: responseObj }, "User logged in successfully")
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
