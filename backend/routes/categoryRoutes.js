import express from "express";
import { addCategory } from "../controllers/categoryController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/add", verifyAccessToken ,addCategory);

export default router;
