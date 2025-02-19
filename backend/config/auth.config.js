import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

// Rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 minutes
  max: 500, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: "Too many attempts, please try again later.",
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers

  // Custom handler to include the remaining time in the response
  handler: (req, res, next, options) => {
    const retryAfter = res.get("Retry-After");
    const retryAfterSeconds = retryAfter
      ? parseInt(retryAfter, 10)
      : Math.ceil(options.windowMs / 1000);
    res.status(options.statusCode).send({
      message: `Too many attempts, please try again after ${retryAfterSeconds} seconds.`,
    });
  },
});

// Global rate limiter for all API endpoints
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 minutes
  max: 1000, // Limit each IP to 100 requests per 5-minute window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers

  // Custom handler to include the remaining time in the response
  handler: (req, res, next, options) => {
    const retryAfter = res.get("Retry-After");
    const retryAfterSeconds = retryAfter
      ? parseInt(retryAfter, 10)
      : Math.ceil(options.windowMs / 1000);
    res.status(options.statusCode).send({
      message: `Too many requests from this IP, please try again after ${retryAfterSeconds} seconds.`,
    });
  },
});

// Your other auth configuration settings
export const authConfig = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
  COOKIE_EXPIRATION: process.env.COOKIE_EXPIRATION || "1d",
};
