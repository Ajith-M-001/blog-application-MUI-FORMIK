import express from "express";
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
  googleAuthCallback,
} from "../controllers/userController.js";
import {
  validateLogin,
  validateSignUp,
} from "../middleware/validationMiddleware.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/verifyToken.js";
import passport from "passport";

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
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/sign-in",
    session: false,
  }),
  googleAuthCallback
);

export default router;
