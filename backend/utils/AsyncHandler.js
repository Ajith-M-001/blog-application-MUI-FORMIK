// utils/AsyncHandler.js
import mongoose from "mongoose";
import { ApiResponse } from "./ApiResponse.js";

export const transactionHandler = (controller) => {
  return async (req, res, next) => {
    // Start a new session for each request
    const session = await mongoose.startSession();
    try {
      // Start the transaction
      await session.startTransaction();

      // Execute the controller with the session
      await controller(req, res, next, session);

      // Commit the transaction if no errors
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();

      // Handle specific MongoDB transaction errors
      if (error.code === 251 && error.codeName === "NoSuchTransaction") {
        return res
          .status(500)
          .json(
            ApiResponse.error(
              "Transaction error: Session mismatch. Please try again.",
              500
            )
          );
      }

      // Pass other errors to the error handler
      next(error);
    } finally {
      // End the session to release resources
      session.endSession();
    }
  };
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
