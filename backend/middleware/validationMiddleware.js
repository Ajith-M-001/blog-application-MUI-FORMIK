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
    .withMessage("First name must be between 3 and 50 characters")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Only alphabets are allowed"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Only alphabets are allowed"),

  body("useEmail").isBoolean().withMessage("useEmail must be a boolean"),

  body("email")
    .if((value, { req }) => req.body.useEmail === true)
    .optional()
    .isEmail()
    .withMessage({ path: "email", message: "Invalid email address" })
    .bail()
    .normalizeEmail(),

  body("phoneNumber")
    .if((value, { req }) => req.body.useEmail !== true)
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .isMobilePhone()
    .withMessage({ path: "phoneNumber", message: "Invalid phone number" }),

  body("country")
    .if((value, { req }) => req.body.useEmail !== true)
    .notEmpty()
    .withMessage("Country code is required with phone number"),

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

  body().custom((_, { req }) => {
    if (req.body.useEmail === true) {
      if (!req.body.email) {
        throw {
          path: "email",
          message: "Email is required when useEmail is true",
        };
      }
    } else {
      if (!req.body.phoneNumber || !req.body.country) {
        throw {
          path: "phoneNumber",
          message:
            "Phone number and country code are required when useEmail is false",
        };
      }
    }
    return true;
  }),

  handleValidation,
];

export const validateLogin = [
  body("useEmail")
    .isBoolean()
    .withMessage("useEmail must be a boolean")
    .custom((value, { req }) => {
      console.log(req.body.useEmail);
    }),

  body("email")
    .if((value, { req }) => req.body.useEmail === true)
    .optional()
    .isEmail()
    .withMessage({ path: "email", message: "Invalid email address" })
    .bail()
    .normalizeEmail(),

  body("phoneNumber")
    .if((value, { req }) => req.body.useEmail !== true)
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .isMobilePhone()
    .withMessage({ path: "phoneNumber", message: "Invalid phone number" }),

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
