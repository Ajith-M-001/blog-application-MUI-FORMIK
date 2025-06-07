import express from "express";
import {
  addCategory,
  getAllCategories,
  getPopularCategories,
} from "../controllers/categoryController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/add", verifyAccessToken, addCategory);
router.get("/all", verifyAccessToken, getAllCategories);
router.get("/popular", getPopularCategories);

export default router;
