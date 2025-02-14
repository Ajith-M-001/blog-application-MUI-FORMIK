import express from "express";
import {
  signInUser,
  signUpUser,
  protectRoute,
} from "../controllers/userController.js";
import {
  validateLogin,
  validateSignUp,
} from "../middleware/validationMiddleware.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/sign-up", validateSignUp, signUpUser);
router.get("/sign-in", validateLogin, signInUser);
router.get("/check", verifyAccessToken, protectRoute);

export default router;
