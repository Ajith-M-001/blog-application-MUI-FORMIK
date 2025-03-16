import express from "express";
import {
  signInUser,
  signUpUser,
  protectRoute,
  signOutUser,
  refreshAccessToken,
  verifyOtp,
  resendOtp,
} from "../controllers/userController.js";
import {
  validateLogin,
  validateSignUp,
} from "../middleware/validationMiddleware.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/sign-up", validateSignUp, signUpUser);
router.get("/sign-in", validateLogin, signInUser);
router.get("/check", verifyAccessToken, protectRoute);
router.post("/sign-out", verifyAccessToken, signOutUser);
router.post("/refresh", verifyRefreshToken, refreshAccessToken);
router.put("/verify-otp", verifyOtp);
router.put("/resent-otp", resendOtp);
export default router;
