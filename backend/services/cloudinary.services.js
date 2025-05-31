import cloudinary from "../config/cloudinary.js";

const processUpload = async (file, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

export const uploadFilesToCloudinary = async (files, options = []) => {
  try {
    const uploadPromises = files.map((file) => processUpload(file, options));
    const results = await Promise.all(uploadPromises);

    const coverImage = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    }));

    return coverImage;
  } catch (error) {
    throw error;
  }
};

export const deleteFilesFromCloudinary = async (publicIds = []) => {
  try {
    const deletePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );
    const results = await Promise.all(deletePromises);

    return results;
  } catch (error) {
    throw error;
  }
};
