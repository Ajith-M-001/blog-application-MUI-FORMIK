import express from "express";
import { addTag } from "../controllers/tagController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/add", verifyAccessToken, addTag);

export default router;
