import express from "express";
import { publishBlog } from "../controllers/blogController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/publish-blog", verifyAccessToken, publishBlog);

export default router;
