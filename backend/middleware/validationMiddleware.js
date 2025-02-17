import { body, validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a uniform structure:
    const formattedErrors = errors.array().map((error) => {
      // Use error.path if available or fallback to the custom message object
      const field =
        error.path ||
        (typeof error.msg === "object" && error.msg.path) ||
        "unknown";
      // If the error message is an object, extract the 'message' property; otherwise use it directly
      const message =
        typeof error.msg === "object" ? error.msg.message : error.msg;
      return { field, message };
    });
    return res
      .status(400)
      .json(ApiResponse.error("Validation failed", 400, formattedErrors));
  }
  next();
}

export const validateSignUp = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("First name must be between 3 and 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage({ path: "email", message: "Invalid email address" })
    .bail()
    .normalizeEmail(),

  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage({ path: "phoneNumber", message: "Invalid phone number" }),

  body("countryCode")
    .optional()
    .matches(/^\+?[1-9]\d{0,3}$/)
    .withMessage({ path: "countryCode", message: "Invalid country code" })
    .bail()
    .custom((value, { req }) => {
      if (req.body.phoneNumber && !value) {
        throw {
          path: "countryCode",
          message: "Country code is required with phone number",
        };
      }
      return true;
    }),

  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage({
      path: "password",
      message:
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 symbol",
    }),

  body("confirmPassword")
    .notEmpty()
    .withMessage({
      path: "confirmPassword",
      message: "Confirm Password is required",
    })
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw {
          path: "confirmPassword",
          message: "Passwords do not match",
        };
      }
      return true;
    }),

  body().custom((value, { req }) => {
    // Contact information validation
    if (!req.body.email && !req.body.phoneNumber) {
      throw {
        path: "emailORPhoneNumber",
        message: "Either email or phone number must be provided",
      };
    }

    // Phone number and country code dependency validation
    if (req.body.phoneNumber && !req.body.countryCode) {
      throw {
        path: "countryCode",
        message: "Country code is required with phone number",
      };
    }

    if (req.body.countryCode && !req.body.phoneNumber) {
      throw {
        path: "phoneNumber",
        message: "Phone number is required with country code",
      };
    }

    return true;
  }),

  handleValidation,
];

export const validateLogin = [
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phoneNumber) {
      throw {
        path: "emailORphoneNumber",
        message: "Either email or phone number must be provided",
      };
    }
    return true;
  }),

  body("password")
    .notEmpty()
    .withMessage({ path: "password", message: "Password is required" })
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage({
      path: "password",
      message:
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 symbol",
    }),
  handleValidation,
];
