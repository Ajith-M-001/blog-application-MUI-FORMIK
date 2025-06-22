import express from "express";
import { verifyAccessToken } from "../utils/verifyToken.js";
import { registerToken } from "../controllers/notificationController.js";

const router = express.Router();

router.put("/register-token", verifyAccessToken, registerToken);

export default router;
