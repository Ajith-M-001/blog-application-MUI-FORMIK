import User from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler, transactionHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateTokens.js";
import { blacklistedTokens } from "../model/token.blacklist.js";
import { generateOTP } from "../utils/otpUtils.js";
import { sendOTPViaEmail } from "../services/emailService.js";
import { sendOTPViaSMS } from "../services/smsServices.js";

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

export const signUpUser = transactionHandler(
  async (req, res, next, session) => {
    const { firstName, lastName, email, password, phoneNumber, country } =
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
    }).session(session);

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

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Create a new user instance with normalized email
    const newUser = new User({
      firstName,
      lastName,
      email: email ? email.toLowerCase() : undefined,
      phoneNumber: phoneNumber || undefined,
      country: country || undefined,
      password,
      verificationCode: otp,
      verificationCodeExpires: otpExpiry,
    });

    // Save the new user to the database
    const savedUser = await newUser.save({ session });

    if (email) {
      await sendOTPViaEmail(savedUser.email, "Your Verification OTP", otp);
    } else if (phoneNumber) {
      await sendOTPViaSMS(`${country?.dial_code}${phoneNumber}`, otp);
    }

    // Convert to a plain object and remove the password field manually
    const responseObj = email
      ? { _id: savedUser._id, email: savedUser.email }
      : {
          _id: savedUser._id,
          phoneNumber: savedUser.phoneNumber,
          country: savedUser.country,
        };

    // Send a success response
    return res
      .status(201)
      .json(
        ApiResponse.created(
          { user: responseObj },
          `Verification code sent to your ${
            email ? "email" : "phone"
          }. Please verify to activate your account.`
        )
      );
  }
);

export const signInUser = asyncHandler(async (req, res) => {
  const { email, password, phoneNumber } = req.body;

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
  const accessToken = req.cookies.access_token;
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token.token !== refreshToken
  );

  if (accessToken) {
    await blacklistedTokens.create({
      token: accessToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
  }

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

export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, otp } = req.body;

  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json(ApiResponse.error("Either Email or phone number is required", 400));
  }

  if (!otp) {
    return res.status(400).json(ApiResponse.error("OTP is required", 400));
  }

  const query = {};
  if (email) {
    query.email = email.toLowerCase();
  } else {
    query.phoneNumber = phoneNumber;
  }

  console.log(query);

  const user = await User.findOne({ $or: [query] }).select(
    "+verificationCode +verificationCodeExpires"
  );
  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  if (user.verificationCode !== otp) {
    return res.status(400).json(ApiResponse.error("Invalid OTP", 400));
  }

  if (user.verificationCodeExpires < new Date()) {
    return res.status(400).json(ApiResponse.error("OTP has expired", 400));
  }

  user.accountStatus = "active";
  email ? (user.isEmailVerified = true) : (user.isPhoneVerified = true);
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();
  return res.status(200).json(ApiResponse.success("OTP verified successfully"));
});
