import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../keys/queryKey";
import { getAllCategory, getAllTags, uploadImages } from "../api/blog.api";
import { showToast } from "../../../shared/utils/toast";

export const useGetAllCategory = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: ({ signal }) => getAllCategory({ signal }),
    ...options,
  });
};

export const useGetAllTags = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.TAGS,
    queryFn: ({ signal }) => getAllTags({ signal }),
    ...options,
  });
};

export const useUploadImage = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, onUploadProgress, signal }) => {
      return await uploadImages(formData, onUploadProgress, signal);
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
