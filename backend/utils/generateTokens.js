import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config.js";

export const generateToken = async (user, sessionId) => {
  try {
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        roles: user.roles,
        sessionId,
      },
      authConfig.JWT_ACCESS_SECRET,
      { expiresIn: authConfig.JWT_ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        roles: user.roles,
        sessionId,
      },
      authConfig.JWT_REFRESH_SECRET,
      { expiresIn: authConfig.JWT_REFRESH_EXPIRES_IN }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Failed to generate tokens", error);
  }
};
