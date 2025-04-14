import {
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
} from "../services/cloudinary.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { v4 as uuid_v4 } from "uuid";

export const uploadImages = asyncHandler(async (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);

  if (files.length === 0) {
    return res.status(400).json(ApiResponse.error("No images uploaded", 400));
  }

  const imageResults = await uploadFilesToCloudinary(files, {
    folder: "NEXUS_blog_application",
    unique_filename: true,
    use_filename: true,
    public_id: uuid_v4(),
    resource_type: "image",
  });

  return res
    .status(200)
    .json(
      ApiResponse.success(
        `${files.length > 1 ? "Images" : "Image"} uploaded successfully`,
        imageResults,
        200
      )
    );
});

export const deleteImage = asyncHandler(async (req, res) => {
  const { public_id = [] } = req.body;

  if (!public_id || public_id.length === 0) {
    return res
      .status(400)
      .json(ApiResponse.error("public_id is required", 400));
  }

  const response = await deleteFilesFromCloudinary(public_id);

  const allDeleted = response.every((res) => res.result === "ok");

  if (!allDeleted) {
    return res
      .status(500)
      .json(ApiResponse.error("Failed to delete one or more images", 500));
  }

  return res
    .status(200)
    .json(
      ApiResponse.success(
        `${public_id.length > 1 ? "Images" : "Image"} deleted successfully`,
        response,
        200
      )
    );
});
