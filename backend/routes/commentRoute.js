import express from "express";
import { verifyAccessToken } from "../utils/verifyToken.js";
import {
  addComment,
  getCommentsForBlog,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/add", verifyAccessToken, addComment);
router.get("/:blogId", getCommentsForBlog);
export default router;
