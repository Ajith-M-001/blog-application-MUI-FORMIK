import User from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateTokens.js";

// Create cookie options for the access token
const accessTokenCookieOptions = {
  httpOnly: true, // Cannot be accessed via client-side JavaScript
  secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
  sameSite: "strict", // Helps mitigate CSRF attacks
  maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
};

// Create cookie options for the refresh token
const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

export const signUpUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, countryCode } =
    req.body;

  const queryConditions = [];

  if (email) {
    queryConditions.push({ email: email.toLowerCase() });
  }

  if (phoneNumber) {
    queryConditions.push({ phoneNumber });
  }

  const existingUser = await User.findOne({
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
  const newUser = new User({
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

export const signInUser = asyncHandler(async (req, res) => {
  const { email, password, phoneNumber } = req.body;
  console.log("login ", email, password, phoneNumber);

  let user;
  if (email) {
    user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
  } else {
    user = await User.findOne({ phoneNumber }).select("+password");
  }

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("invalid credentials"));
  }

  const isPasswordMAtched = await bcrypt.compare(password, user.password);

  if (!isPasswordMAtched) {
    return res.status(404).json(ApiResponse.notFound("invalid credentials"));
  }

  const tokens = await generateToken(user);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  user.refreshTokens.push({
    token: tokens.refreshToken,
    issueAt: Date.now(),
    expiresAt: refreshTokenExpiry,
  });

  await user.save();

  // Set both tokens as cookies
  res.cookie("access_token", tokens.accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", tokens.refreshToken, refreshTokenCookieOptions);

  const responseObj = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: user.roles,
  };
  res.status(200).json(ApiResponse.success("sign in successful", responseObj));
});

export const protectRoute = asyncHandler(async (req, res, next) => {
  res.send({ message: "protect route working" });
});

export const signOutUser = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token.token !== refreshToken
  );

  await user.save();

  // Clear cookies
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res.status(200).json(ApiResponse.success("Signed out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const oldRefreshToken = req.cookies.refresh_token;
  const userId = req.user._id;
  const user = await User.findById(userId);

  // Find the specific token record
  const tokenRecord = user.refreshTokens.find(
    (rt) => rt.token === oldRefreshToken
  );

  if (!tokenRecord || new Date(tokenRecord.expiresAt) < new Date()) {
    user.refreshTokens = user.refreshTokens(
      (rt) => rt.token !== oldRefreshToken
    );
    await user.save();
    return res
      .status(401)
      .json(ApiResponse.error("Refresh token has expired", 401));
  }
  // Generate new tokens
  const tokens = await generateToken(user);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  // Replace the old refresh token with the new one
  user.refreshTokens = user.refreshTokens.filter(
    (rt) => rt.token !== oldRefreshToken
  );
  user.refreshTokens.push({
    token: tokens.refreshToken,
    issueAt: Date.now(),
    expiresAt: refreshTokenExpiry,
  });
  await user.save();
  // Set the new tokens as cookies
  res.cookie("access_token", tokens.accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", tokens.refreshToken, refreshTokenCookieOptions);

  return res
    .status(200)
    .json(ApiResponse.success("Access token refreshed successfully"));
});
