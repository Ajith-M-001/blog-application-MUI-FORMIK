import dotenv from "dotenv";

dotenv.config();

export const authConfig = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_SUCCESS_REDIRECT: "http://localhost:5173/",
  GOOGLE_FAILURE_REDIRECT: "http://localhost:5173/login",
  CLIENT_ERROR_REDIRECT: "http://localhost:5173/error",
};
