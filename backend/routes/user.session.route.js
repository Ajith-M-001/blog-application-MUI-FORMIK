import express from "express";
import {
  validateLogin,
  validateSignUp,
} from "../middleware/validationMiddleware.js";
import {
  registerUser,
  loginUser,
  protectedRoute,
  logoutUser,
} from "../controllers/user.session.controller.js";
import { checkIdleTime, validateSession } from "../middleware/validateSession.js";
import { authLimiter } from "../config/auth.config.js";

const router = express.Router();

router.post("/register", validateSignUp, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);
router.get("/protected",checkIdleTime, validateSession, protectedRoute);
router.post('/logout', validateSession , logoutUser)

export default router;
