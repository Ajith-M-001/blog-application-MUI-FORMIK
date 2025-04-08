import express from "express";
import { publishBlog, getAllBlog } from "../controllers/blogController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/publish-blog", verifyAccessToken, publishBlog);
router.get("/all", verifyAccessToken, getAllBlog);

export default router;
