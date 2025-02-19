import express from "express";
import {
  register,
  login,
  logout,
} from "../controllers/user.session.controller.js";
import { validateSignUp } from "../middleware/validationMiddleware.js";
import { checkIdleSession, requireAuth } from "../middleware/requireAuth.js";
import { protectRoute } from "../controllers/userController.js";
const router = express.Router();

router.post("/register", validateSignUp, register);
router.post("/login", login);
router.get("/check", checkIdleSession, requireAuth, protectRoute);
router.post("/logout", requireAuth, logout);

export default router;
