import express from "express";
import { addTag, getAllTags } from "../controllers/tagController.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/add", verifyAccessToken, addTag);
router.get("/all", verifyAccessToken, getAllTags);

export default router;
