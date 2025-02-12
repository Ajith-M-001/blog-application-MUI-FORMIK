import { body, validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    .withMessage("Invalid email address")
    .bail()
    .normalizeEmail(),
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("countryCode")
    .optional()
    .matches(/^\+?[1-9]\d{0,3}$/)
    .withMessage("Invalid country code")
    .bail()
    .custom((value, { req }) => {
      if (req.body.phoneNumber && !value) {
        throw new Error("Country code is required with phone number");
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
    .withMessage(
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 symbol"
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phoneNumber) {
      throw new Error("Either email or phone number must be provided");
    }
    if (req.body.phoneNumber && !req.body.countryCode) {
      throw new Error("Country code is required with phone number");
    }
    if (req.body.countryCode && !req.body.phoneNumber) {
      throw new Error("Phone number is required with country code");
    }
    return true;
  }),
  (req, res, next) => handleValidation(req, res, next),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      ApiResponse.badRequest(
        "Validation failed",
        errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        }))
      )
    );
  }
  next();
};
