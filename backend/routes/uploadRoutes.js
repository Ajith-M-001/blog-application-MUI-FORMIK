import express from "express";
import { deleteImage, uploadImages } from "../controllers/uploadController.js";
import {
  config,
  multerUpload,
  validateImageDimensions,
} from "../middleware/multer.middleware.js";
import { verifyAccessToken } from "../utils/verifyToken.js";

const router = express.Router();
router.post(
  "/upload-images",
  verifyAccessToken,
  multerUpload.array(config.IMAGE.FIELD_NAME, config.IMAGE.MAX_FILES),
  validateImageDimensions,
  uploadImages
);

router.delete("/delete-image", verifyAccessToken, deleteImage);

export default router;
