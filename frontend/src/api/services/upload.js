import { axiosInstance } from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const uploadService = {
  uploadImages: async (formData, onProgress) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.upload.uploadImages,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) onProgress?.(percentCompleted);
        },
      }
    );
    return response.data;
  },
};
