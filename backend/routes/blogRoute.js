import express from "express";
import {
  publishBlog,
  getAllBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/publish-blog", verifyAccessToken, publishBlog);
router.get("/all", verifyAccessToken, getAllBlog);
router.get("/:slug", verifyAccessToken, getBlogBySlug);
router.put("/:id", verifyAccessToken, updateBlog);
router.delete("/:id", verifyAccessToken, deleteBlog);

export default router;
