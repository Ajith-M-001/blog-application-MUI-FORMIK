import express from "express";
import { addCategory, getAllCategories } from "../controllers/categoryController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/add", verifyAccessToken, addCategory);
router.get("/all", verifyAccessToken, getAllCategories);

export default router;
