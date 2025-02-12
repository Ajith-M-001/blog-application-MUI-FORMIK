import { ApiResponse } from "../utils/ApiResponse.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error("Error: ", err);

  // Set the appropriate status code, defaulting to 500 if it hasn't been set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Set default error message
  let message = err.message;

  // Handle specific errors, e.g., MongoDB duplicate key error (11000)
  if (err.code === 11000) {
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(
      ", "
    )} already exists.`;
  }

  // Respond with the ApiResponse error format
  res.status(statusCode).json(
    ApiResponse.error(
      message,
      statusCode,
      process.env.NODE_ENV === "production" ? null : err.stack // Show stack trace only in development mode
    )
  );
};

export { notFound, errorHandler };
