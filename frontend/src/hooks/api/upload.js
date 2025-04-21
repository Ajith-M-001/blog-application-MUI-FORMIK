import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadService } from "../../api/services/upload";
import { showToast } from "../../utils/toast";

export const QUERY_KEYS = {
  UPLOADS: ["uploads"],
};

export const useUploadImage = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, onUploadProgress, signal }) => {
      return await uploadService.uploadImages(
        formData,
        onUploadProgress,
        signal
      );
    },
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.UPLOADS);
    },
    onError: (error) => {
      console.log("Error uploading image", error);
      console.log("Error uploading image", error?.response?.data);

      const errorMessage =
        error?.response?.data?.message || error.message || "Upload failed";

      showToast(errorMessage, { type: "error" });
    },
  });
};
