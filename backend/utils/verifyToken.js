import jwt from "jsonwebtoken";
import { ApiResponse } from "./ApiResponse.js";
import { authConfig } from "../config/auth.config.js";
import User from "../model/user.schema.js";
import { blacklistedTokens } from "../model/token.blacklist.js";
import bcrypt from "bcrypt";

export const verifyAccessToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res
      .status(401)
      .json(
        ApiResponse.unauthorized(
          "unauthorized : Access token is missing. Please log in."
        )
      );
  }

  try {
    const isBlacklisted = await blacklistedTokens.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(401)
        .json(ApiResponse.unauthorized("unauthorized:access token is invalid"));
    }
    const decoded = jwt.verify(token, authConfig.JWT_ACCESS_SECRET);
    console.log("decoded", decoded);
    const user = await User.findById(decoded._id).select(
      "email firstName lastName roles accountStatus country phoneNumber"
    );
    if (!user) {
      return res
        .status(401)
        .json(
          ApiResponse.unauthorized(
            "unauthorized: Invalid access token: User not found."
          )
        );
    }

    if (user.accountStatus !== "active") {
      if (user.accountStatus === "inactive") {
        const responseOBJ = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          country: user.country,
          phoneNumber: user.phoneNumber,
        };
        return res
          .status(403)
          .json(
            ApiResponse.forbidden(
              "Account is inactive, please verify your account",
              responseOBJ
            )
          );
      }
      return res
        .status(403)
        .json(
          ApiResponse.forbidden(
            "Account is not active, please contact customer support"
          )
        );
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  console.log("refreshTokenfsgdfgdg", refreshToken);
  if (!refreshToken) {
    return res
      .status(401)
      .json(
        ApiResponse.unauthorized(
          "unauthorized : refresh token is missing. Please log in."
        )
      );
  }
  try {
    const decoded = jwt.verify(refreshToken, authConfig.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id).select(
      "email firstName lastName roles accountStatus refreshTokens"
    );
    if (!user) {
      return res
        .status(401)
        .json(
          ApiResponse.unauthorized(
            "unauthorized: Invalid refresh token: User not found."
          )
        );
    }

    if (user.accountStatus === "active") {
      const isValidRefreshToken = user.refreshTokens.some(async (rt) => {
        return await bcrypt.compare(refreshToken, rt.token);
      });
      if (!isValidRefreshToken) {
        return res
          .status(401)
          .json(
            ApiResponse.unauthorized("unauthorized: Invalid refresh token")
          );
      }
      req.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};
