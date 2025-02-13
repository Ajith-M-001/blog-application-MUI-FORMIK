import express from "express";
import { signInUser, signUpUser } from "../controllers/userController.js";
import {
  validateLogin,
  validateSignUp,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/sign-up", validateSignUp, signUpUser);
router.get("/sign-in", validateLogin, signInUser);

export default router;
