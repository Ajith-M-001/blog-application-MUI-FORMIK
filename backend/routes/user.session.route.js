import express from "express";
import { validateSignUp } from "../middleware/validationMiddleware.js";
import { registerUser } from "../controllers/user.session.controller.js";

const router = express.Router();

router.post("/register", validateSignUp, registerUser);

export default router;
