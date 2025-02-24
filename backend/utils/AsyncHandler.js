import mongoose from "mongoose";

// Typical asyncHandler implementation
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(error.code || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

// Transaction handler wrapper
export const transactionHandler = (fn) => {
  return asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      await fn(req, res, next, session); // Pass session to the handler
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error; // This will be caught by asyncHandler
    } finally {
      session.endSession();
    }
  });
};
