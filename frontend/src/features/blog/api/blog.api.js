import { axiosInstance } from "../../../api/axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const getAllTags = async ({ signal }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.tags.all, {
    signal,
  });
  return response.data;
};

export const uploadImages = async (formData, onProgress, signal) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.upload.uploadImages,
      formData,
      {
        timeout: 180000, // 3 minutes timeout
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress?.(percentCompleted);
          }
        },
        signal: signal, // Support for cancellation
      }
    );

    return response.data;
  } catch (error) {
    // Check if this is an abort error
    if (error.name === "AbortError" || error.name === "CanceledError") {
      throw new Error("Upload cancelled");
    }

    // Handle timeout specifically
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Upload timed out. Please try again with a smaller file or check your connection."
      );
    }

    // Rethrow the error with more context
    throw error;
  }
};

export const getAllCategory = async ({ signal }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.categories.all, {
    signal,
  });
  return response.data;
};
