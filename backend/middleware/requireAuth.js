import userModel from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const requireAuth = async (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json(
        ApiResponse.unauthorized("unauthorized : user missing. Please log in.")
      );
  }

  try {
    const user = await userModel
      .findById(req.session.userId)
      .select("+sessions");
    if (!user) {
      return res
        .status(401)
        .json(ApiResponse.unauthorized("unauthorized: User not found."));
    }
    if (!user.isActive) {
      return res.status(403).json(ApiResponse.forbidden("Account is inactive"));
    }
    user.sessions.forEach((session) => {
      if (session.sessionId === req.session.sessionId) {
        session.lastActive = new Date();
      }
    });

    await user.save();
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkIdleSession = asyncHandler(async (req, res, next) => {
  if (req.session.userId) {
    const user = await userModel
      .findById(req.session.userId)
      .select("+sessions");

    const session = user.sessions.find(
      (session) => session.sessionId === req.session.sessionId
    );

    if (session) {
      const lastActivity = session.lastActive;
      const idleTime = Date.now() - lastActivity.getTime();
      const maxTime = 60 * 1000; // 1 minute

      console.log("Current Time:", Date.now());
      console.log("Last Activity Time:", lastActivity.getTime());
      console.log("ideal time", idleTime, maxTime);

      if (idleTime > maxTime) {
        // Destroy the session in the database
        user.sessions.pull({ sessionId: req.session.sessionId });
        await user.save();

        // Destroy the current session
        req.session.destroy((err) => {
          if (err) {
            console.error("Failed to destroy session:", err);
            return res
              .status(500)
              .json(ApiResponse.error("Failed to log out", 500));
          }
          res.clearCookie("blog.sid"); // Replace with your session cookie name if different
          return res
            .status(401)
            .json(
              ApiResponse.unauthorized(
                "Session expired due to inactivity. Please log in again."
              )
            );
        });
        return; // Exit the middleware
      }
    }
  }
  next();
});
