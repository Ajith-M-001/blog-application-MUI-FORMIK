import express from "express";
import {
  publishBlog,
  getAllBlog,
  getPersonalizedBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getTrendingBlogs,
  getRelatedBlogs,
} from "../controllers/blogController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";
import { validatePublishBlog } from "../middleware/blogValidators.js";

const router = express.Router();

router.post(
  "/publish-blog",
  verifyAccessToken,
  validatePublishBlog,
  publishBlog
);
router.get("/for_you", verifyAccessToken, getPersonalizedBlogs);
router.get("/all", getAllBlog);
router.get("/trending", getTrendingBlogs);
router.get("/related/:slug", getRelatedBlogs);
router.get("/:slug", getBlogBySlug);
router.put("/:id", verifyAccessToken, updateBlog);
router.delete("/:id", verifyAccessToken, deleteBlog);

export default router;
