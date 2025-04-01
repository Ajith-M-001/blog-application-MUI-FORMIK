import User from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler, transactionHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateTokens.js";
import { generateOTP } from "../utils/otpUtils.js";
import { sendOTPViaEmail } from "../services/emailService.js";
import { sendOTPViaSMS } from "../services/smsServices.js";
import { v4 as uuidv4 } from "uuid";
import { SESSION_PREFERENCE } from "../../common/constants/constants.js";
import { authConfig } from "../config/auth.config.js";
import { getMaxAgeFromExpiresIn } from "../utils/getMaxAgeFromExpiresIn.js";

// Create cookie options for the access token
const accessTokenCookieOptions = {
  httpOnly: true, // Cannot be accessed via client-side JavaScript
  secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
  sameSite: "strict", // Helps mitigate CSRF attacks
  maxAge: getMaxAgeFromExpiresIn(authConfig.JWT_ACCESS_EXPIRES_IN),
};

// Create cookie options for the refresh token
const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: getMaxAgeFromExpiresIn(authConfig.JWT_REFRESH_EXPIRES_IN),
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
      "+password +refreshTokens"
    );
  } else {
    user = await User.findOne({ phoneNumber }).select(
      "+password +refreshTokens"
    );
  }

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("invalid credentials"));
  }

  const isPasswordMAtched = await bcrypt.compare(password, user.password);

  if (!isPasswordMAtched) {
    return res
      .status(404)
      .json(ApiResponse.notFound("invalid credentials 123"));
  }

  const sessionId = uuidv4();
  const tokens = await generateToken(user, sessionId);
  const refreshTokenExpiry = new Date(
    Date.now() + getMaxAgeFromExpiresIn(authConfig.JWT_REFRESH_EXPIRES_IN)
  );

  const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || req.connection.remoteAddress || "";

  const newSession = {
    sessionId,
    token: hashedRefreshToken,
    deviceInfo: {
      os: getUserOS(userAgent),
      browser: getBrowser(userAgent),
      ip: ip,
      userAgent: userAgent,
      lastLocation: "",
    },
    loggedInAt: Date.now(),
    lastActive: Date.now(),
    expiresAt: refreshTokenExpiry,
  };

  if (user.sessionPreference === SESSION_PREFERENCE.SINGLE) {
    user.refreshTokens = [newSession];
  } else if (user.sessionPreference === SESSION_PREFERENCE.MULTIPLE) {
    if (user.refreshTokens.length >= user.maxSession) {
      user.refreshTokens.sort((a, b) => a.loggedInAt - b.loggedInAt);
      user.refreshTokens.shift();
    }
    user.refreshTokens.push(newSession);
  }

  await user.save();

  // Set both tokens as cookies
  res.cookie("access_token", tokens.accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", tokens.refreshToken, refreshTokenCookieOptions);

  return res.status(200).json(ApiResponse.success("sign in successful"));
});

export const protectRoute = asyncHandler(async (req, res, next) => {
  res.send({ message: "protect route working" });
});

export const signOutUser = asyncHandler(async (req, res, next) => {
  const { removeAllSession = false } = req.body;
  const sessionId = req.user.sessionId;

  if (!sessionId)
    return res.status(401).json(ApiResponse.unauthorized("Unauthorized"));

  const userId = req.user._id;
  const user = await User.findById(userId).select("+refreshTokens");

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  if (removeAllSession) {
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.sessionId === sessionId
    );
  } else {
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.sessionId !== sessionId
    );
    // Clear cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
  }

  await user.save();

  const message = removeAllSession
    ? "All other sessions signed out successfully"
    : "Signed out successfully";

  return res.status(200).json(ApiResponse.success(message));
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const oldRefreshToken = req.cookies.refresh_token;
  const session_Id = req.user.sessionId;

  if (!oldRefreshToken)
    return res
      .status(401)
      .json(ApiResponse.unauthorized("Refresh token is missing"));

  const userId = req.user._id;
  const user = await User.findById(userId).select("+refreshTokens");

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  const sessionIndex = user.refreshTokens.findIndex(
    (rt) => rt.sessionId === session_Id
  );
  if (sessionIndex === -1) {
    return res.status(401).json(ApiResponse.unauthorized("Invalid session"));
  }

  const sessionToken = user.refreshTokens[sessionIndex];

  const expiresAtTimestamp = new Date(sessionToken.expiresAt).getTime();
  if (expiresAtTimestamp < Date.now()) {
    user.refreshTokens.splice(sessionIndex, 1);
    await user.save();
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res
      .status(401)
      .json(ApiResponse.unauthorized("Refresh token expired"));
  }

  const isRefreshTokenMatched = await bcrypt.compare(
    oldRefreshToken,
    sessionToken.token
  );

  if (!isRefreshTokenMatched) {
    return res
      .status(401)
      .json(ApiResponse.unauthorized("Invalid refresh token"));
  }

  // Generate new tokens
  const tokens = await generateToken(user, session_Id);
  const refreshTokenExpiry = new Date(
    Date.now() + getMaxAgeFromExpiresIn(authConfig.JWT_REFRESH_EXPIRES_IN)
  ); // 7 days

  const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

  user.refreshTokens[sessionIndex] = {
    ...sessionToken.toObject(),
    token: hashedRefreshToken,
    expiresAt: refreshTokenExpiry,
    lastActive: Date.now(),
  };
  await user.save();
  // Set the new tokens as cookies
  res.cookie("access_token", tokens.accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", tokens.refreshToken, refreshTokenCookieOptions);

  return res
    .status(200)
    .json(ApiResponse.success("Access token refreshed successfully"));
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, otp, reset = false } = req.body;

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

  const requiredFields = reset
    ? "+forgotPasswordCode +forgotPasswordExpires"
    : "+verificationCode +verificationCodeExpires";

  const user = await User.findOne({ $or: [query] }).select(requiredFields);

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  if (reset) {
    const storedOtp = String(user.forgotPasswordCode).trim();
    const providedOtp = String(otp).trim();

    if (storedOtp !== providedOtp) {
      return res.status(400).json(ApiResponse.error("Invalid OTP true", 400));
    }

    if (user.forgotPasswordExpires < new Date()) {
      return res.status(400).json(ApiResponse.error("OTP has expired", 400));
    }

    console.log("check", user.forgotPasswordCode, otp);

    if (storedOtp === providedOtp) {
      user.forgotPasswordCode = undefined;
      user.forgotPasswordExpires = undefined;
      await user.save();
    }
  } else {
    const storedOtp = String(user.verificationCode).trim();
    const providedOtp = String(otp).trim();
    if (storedOtp !== providedOtp) {
      return res.status(400).json(ApiResponse.error("Invalid OTP", 400));
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json(ApiResponse.error("OTP has expired", 400));
    }

    if (storedOtp === providedOtp) {
      user.accountStatus = "active";
      email ? (user.isEmailVerified = true) : (user.isPhoneVerified = true);
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();
    }
  }

  return res.status(200).json(ApiResponse.success("OTP verified successfully"));
});

export const resendOtp = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json(ApiResponse.error("Either Email or phone number is required", 400));
  }

  const query = {};
  if (email) {
    query.email = email.toLowerCase();
  } else {
    query.phoneNumber = phoneNumber;
  }

  const user = await User.findOne({ $or: [query] }).select(
    "+verificationCode +verificationCodeExpires"
  );
  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  if (user.verificationCodeExpires > new Date()) {
    return res
      .status(400)
      .json(ApiResponse.error("OTP has already been sent", 400));
  }

  const otp = generateOTP();
  user.verificationCode = otp;
  user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  if (email) {
    await sendOTPViaEmail(user.email, "OTP Verification", otp);
  } else {
    await sendOTPViaSMS(`${user.country.dial_code}${user.phoneNumber}`, otp);
  }

  return res.status(200).json(ApiResponse.success("OTP sent successfully"));
});

export const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json(ApiResponse.success("User details", user));
});

export const updateSessionPreference = asyncHandler(async (req, res, next) => {
  const { newPreference, maxSessions = 5 } = req.body;
  const currentSessionId = req.user.sessionId;

  if (
    !newPreference ||
    !Object.values(SESSION_PREFERENCE).includes(newPreference)
  ) {
    return res
      .status(400)
      .json(
        ApiResponse.error(
          "Invalid session preference. Use 'single' or 'multiple'"
        )
      );
  }
  const user = await User.findById(req.user._id).select("+refreshTokens");
  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  const oldPreference = user.sessionPreference;

  if (newPreference === oldPreference) {
    return res.status(200).json(
      ApiResponse.success(
        "Session preference is already set to the requested value",
        {
          sessionPreference: newPreference,
          maxSessions: user.maxSession,
          activeSessions: user.refreshTokens.length,
        }
      )
    );
  }

  user.sessionPreference = newPreference;

  if (newPreference === SESSION_PREFERENCE.MULTIPLE) {
    if (maxSessions < 1 || maxSessions > 20) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Maximum number of sessions should be between 1 and 20"
          )
        );
    }
    user.maxSession = maxSessions;
  }

  if (
    newPreference === SESSION_PREFERENCE.SINGLE &&
    oldPreference === SESSION_PREFERENCE.MULTIPLE
  ) {
    user.maxSession = 1;
    // keep only the current session
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token.sessionId === currentSessionId
    );
  }

  await user.save();
  return res.status(200).json(
    ApiResponse.success(`Session preference updated to ${newPreference}`, {
      sessionPreference: newPreference,
      maxSessions: user.maxSession,
      activeSessions: user.refreshTokens.length,
    })
  );
});

export const forgotPassword = transactionHandler(async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json(ApiResponse.error("Either Email or phone number is required", 400));
  }

  const query = {};
  if (email) {
    query.email = email.toLowerCase();
  } else {
    query.phoneNumber = phoneNumber;
  }

  const user = await User.findOne({ $or: [query] }).select(
    "+forgotPasswordCode +forgotPasswordExpires"
  );

  console.log("user", user.forgotPasswordExpires, new Date());
  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  if (user.forgotPasswordExpires > new Date()) {
    return res
      .status(400)
      .json(ApiResponse.error("OTP has already been sent", 400));
  }

  const otp = generateOTP();
  const forgotOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.forgotPasswordCode = otp;
  user.forgotPasswordExpires = forgotOTPExpiry;

  await user.save();

  if (email) {
    await sendOTPViaEmail(email, "Your Verification OTP", otp, true);
  } else if (phoneNumber) {
    await sendOTPViaSMS(`${user.country?.dial_code}${phoneNumber}`, otp, true);
  }

  return res.status(200).json(ApiResponse.success("OTP sent successfully"));
});

export const ResetPassword = transactionHandler(
  async (req, res, next, session) => {
    const { password, currentPassword, confirmPassword, fromOTPVerification } =
      req.body;

    if (
      !password ||
      !confirmPassword ||
      (fromOTPVerification === false && !currentPassword)
    ) {
      return res
        .status(400)
        .json(ApiResponse.error("All required fields must be provided.", 400));
    }

    // Check if the new password and confirmPassword match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json(ApiResponse.error("Passwords do not match.", 400));
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json(
          ApiResponse.error("Password must be at least 8 characters long", 400)
        );
    }

    const user = await User.findById(req.user._id)
      .select("+password")
      .session(session);
    if (!user) {
      return res.status(404).json(ApiResponse.notFound("User not found"));
    }

    if (!fromOTPVerification) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json(ApiResponse.error("Current password is incorrect.", 400));
      }
    }

    user.refreshTokens = [];
    user.password = password;
    res.clearCookie("access_token", accessTokenCookieOptions);
    res.clearCookie("refresh_token", refreshTokenCookieOptions);

    await user.save({ session });

    return res
      .status(200)
      .json(
        ApiResponse.success(
          fromOTPVerification
            ? "Password has been reset successfully. Please log in with your new password."
            : "Password has been changed successfully."
        )
      );
  }
);

// Helper function to extract OS from user agent
function getUserOS(userAgent) {
  if (!userAgent) return "Unknown";
  if (userAgent.includes("Windows NT")) return "Windows";
  if (userAgent.includes("Mac")) return "MacOS";
  if (userAgent.includes("Android")) return "Android";
  if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  )
    return "iOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "Unknown";
}

// Helper function to extract browser from user agent
function getBrowser(userAgent) {
  if (!userAgent) return "Unknown";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/"))
    return "Internet Explorer";
  return "Unknown";
}
