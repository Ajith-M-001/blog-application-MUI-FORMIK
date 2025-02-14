import jwt from "jsonwebtoken";
import { ApiResponse } from "./ApiResponse.js";
import { authConfig } from "../config/auth.config.js";
import User from "../model/user.schema.js";

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
    const decoded = jwt.verify(token, authConfig.JWT_ACCESS_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded._id).select(
      "email firstName lastName roles isActive"
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

    if (!user.isActive) {
      return res.status(403).json(ApiResponse.forbidden("Account is inactive"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyRefreshToken = (req, res, next) => {};
