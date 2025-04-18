import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadService } from "../../api/services/upload";
import { showToast } from "../../utils/toast";

export const QUERY_KEYS = {
  UPLOADS: ["uploads"],
};

export const useUploadImage = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, onUploadProgress }) =>
      uploadService.uploadImages(formData, onUploadProgress),
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.UPLOADS);
    },
    onError: (error) => {
      console.log("Error uploading image", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};
