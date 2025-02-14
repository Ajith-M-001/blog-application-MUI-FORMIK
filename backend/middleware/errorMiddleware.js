import { ApiResponse } from "../utils/ApiResponse.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  // Initialize variables for response
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Something went Wrong";
  let errorData = process.env.NODE_ENV === "development" ? err.stack : null;

  // Handle specific errors, e.g., MongoDB duplicate key error (11000)
  if (err.code === 11000) {
    const duplicateFields = Object.keys(err.keyValue);
    const duplicateValues = Object.values(err.keyValue);

    if (duplicateFields.length > 1) {
      // For multiple duplicate keys, format each field and its value
      message = `Duplicate: ${duplicateFields
        .map((field, index) => `${field}: ${duplicateValues[index]}`)
        .join(", ")} already exist.`;
    } else {
      // For a single duplicate key, use a simpler message
      message = `Duplicate ${duplicateFields[0]}: ${duplicateValues[0]} already exists.`;
    }
  }

  // Handle Mongoose CastError (invalid ObjectId)
  // if (err.name === "CastError") {
  //   statusCode = 400;
  //   message = `Invalid ${err.path}: ${err.value}`;
  // }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again to continue.";
  }

  // // Handle multer errors
  // if (err.name === "MulterError") {
  //   statusCode = 400;
  //   message = err.message;
  //   errorData = {
  //     field: err.field,
  //   };
  // }

  // Send error response using ApiResponse utility
  res
    .status(statusCode)
    .json(ApiResponse.error(message, statusCode, errorData));
};

export { notFound, errorHandler };
