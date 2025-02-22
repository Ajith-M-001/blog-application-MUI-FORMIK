import { COOKIE_NAME } from "../config/session.config.js";
import userModel from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const IDLE_TIMEOUT =
  process.env.NODE_ENV === "production"
    ? 30 * 60 * 1000 // 30 minutes in production
    : 1 * 60 * 1000; // 5 minutes in development

const validateSession = async (req, res, next) => {
  console.log("REQ1", req.session);
  console.log("REQ2", req.session.user);
  if (!req.session || !req.session.user) {
    return res.status(401).json(ApiResponse.error("Unauthorized", 401));
  }
  const user = await userModel.findById(req.session.user._id);
  if (!user) {
    await req.session.destroy();
    return res.status(401).json(ApiResponse.error("Unauthorized", 401));
  }
  next();
};

const checkIdleTime = async (req, res, next) => {
  const MAX_IDLE_TIME = IDLE_TIMEOUT;
  const currentTime = Date.now();
  const lastActivity = req.session.lastActivity || currentTime;
  const timeSinceLastActivity = currentTime - lastActivity;

  console.log("MAX_IDLE_TIME", MAX_IDLE_TIME);
  console.log("currentTime", currentTime);
  console.log("lastActivity", lastActivity);
  console.log("timeSinceLastActivity", timeSinceLastActivity);
  if (timeSinceLastActivity > MAX_IDLE_TIME) {
    await req.session.destroy(COOKIE_NAME);
    return res
      .status(401)
      .json(ApiResponse.error("Session expired. please login again", 401));
  }
  req.session.lastActivity = currentTime;
  await req.session.save();
  next();
};

export { validateSession, checkIdleTime };
