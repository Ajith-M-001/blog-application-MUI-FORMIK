import multer from "multer";
import sharp from "sharp";
import { ApiResponse } from "../utils/ApiResponse.js";

export const config = {
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB per file
    MAX_FILES: 10,
    FIELD_NAME: "images",
    DIMENSIONS: { width: 1280, height: 720 },
  },
};

export const ALLOWED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/avif",
];

const storage = multer.memoryStorage();

// Multer file filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (!ALLOWED_FORMATS.includes(file.mimetype)) {
    return cb(
      new Error(
        `Only images are allowed. Supported formats: ${ALLOWED_FORMATS.map(
          (format) => format.split("/")[1]
        ).join(", ")}`
      ),
      false
    );
  }

  cb(null, true);
};

const multerUpload = multer({
  storage,
  limits: {
    fileSize: config.IMAGE.MAX_SIZE,
    files: config.IMAGE.MAX_FILES,
  },
  fileFilter,
});

const validateImageDimensions = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No images uploaded",
        code: 400,
      });
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = await sharp(file.buffer).metadata();

      if (
        metadata.width !== config.IMAGE.DIMENSIONS.width ||
        metadata.height !== config.IMAGE.DIMENSIONS.height
      ) {
        return res
          .status(400)
          .json(
            ApiResponse.error(
              `Image ${files.length > 1 ? `#${i + 1} ` : ""}must be ${
                config.IMAGE.DIMENSIONS.width
              }x${config.IMAGE.DIMENSIONS.height} pixels. Received: ${
                metadata.width
              }x${metadata.height} pixels.`,
              400
            )
          );
      }
    }

    next();
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

export { multerUpload, validateImageDimensions };
