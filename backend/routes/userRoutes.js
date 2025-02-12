import express from "express";
import { signUpUser } from "../controllers/userController.js";
import { validateSignUp } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/sign-up", validateSignUp, signUpUser);

export default router;
