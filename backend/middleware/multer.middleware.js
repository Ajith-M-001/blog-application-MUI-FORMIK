import multer from "multer";
import sharp from "sharp";
import { ApiResponse } from "../utils/ApiResponse.js";

export const config = {
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB per file
    MAX_FILES: 10,
    FIELD_NAME: "images",
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

    const expectedRatio = 16 / 9;
    const tolerance = 0.03;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = await sharp(file.buffer).metadata();
      const actualRatio = metadata.width / metadata.height;

      if (Math.abs(actualRatio - expectedRatio) > tolerance) {
        return res
          .status(400)
          .json(
            ApiResponse.error(
              `Image ${
                files.length > 1 ? `#${i + 1} ` : ""
              }must have a 16:9 aspect ratio. Received: ${metadata.width}x${
                metadata.height
              } (≈ ${actualRatio.toFixed(2)}:1)`,
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
