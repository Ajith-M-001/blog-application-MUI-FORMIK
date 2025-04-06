import express from "express";
import passport from "passport";
import {
  signInUser,
  signUpUser,
  protectRoute,
  signOutUser,
  refreshAccessToken,
  verifyOtp,
  resendOtp,
  getUserDetails,
  updateSessionPreference,
  forgotPassword,
  ResetPassword,
  resetPasswordWithOTP,
  handleGoogleAuthCallback,
} from "../controllers/userController.js";
import {
  validateLogin,
  validateSignUp,
} from "../middleware/validationMiddleware.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/sign-up", validateSignUp, signUpUser);
router.post("/sign-in", validateLogin, signInUser);
router.get("/check", verifyAccessToken, protectRoute);
router.post("/sign-out", verifyAccessToken, signOutUser);
router.post("/refresh", verifyRefreshToken, refreshAccessToken);
router.get("/get-user-details", verifyAccessToken, getUserDetails);
router.put("/session-preference", verifyAccessToken, updateSessionPreference);
router.put("/reset-password", verifyAccessToken, ResetPassword);
router.put("/verify-otp", verifyOtp);
router.put("/resent-otp", resendOtp);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password-with-otp", resetPasswordWithOTP);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/sign-in?auth=google_auth_failed",
  }),
  handleGoogleAuthCallback
);

export default router;
