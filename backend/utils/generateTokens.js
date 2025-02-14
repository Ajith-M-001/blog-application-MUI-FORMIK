import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config.js";
import { asyncHandler } from "./AsyncHandler.js";

export const generateToken = async (user) => {
  try {
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        roles: user.roles,
      },
      authConfig.JWT_ACCESS_SECRET,
      { expiresIn: authConfig.JWT_ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        roles: user.roles,
      },
      authConfig.JWT_REFRESH_SECRET,
      { expiresIn: authConfig.JWT_REFRESH_EXPIRES_IN }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    next(error);
  }
};
