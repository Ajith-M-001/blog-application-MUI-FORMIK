import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../keys/queryKey";
import {
  deleteBlog,
  getAllBlogs,
  getAllCategory,
  getAllTags,
  getBlogBySlug,
  publishBlog,
  updateBlog,
  uploadImages,
} from "../api/blog.api";
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

export const usePublishBlog = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogData }) => publishBlog({ blogData }),
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEYS.BLOGS);
      showToast(data?.message, { type: "success" });
    },
  });
};

export const useGetAllBlogs = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BLOGS,
    queryFn: ({ signal }) => getAllBlogs({ signal }),
    ...options,
  });
};

export const useGetBlogBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BLOG, slug],
    queryFn: ({ signal }) => getBlogBySlug({ slug, signal }),
    ...options,
  });
};

export const useUpdateBlog = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blogData }) => updateBlog({ id, blogData }),
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEYS.BLOGS);
      showToast(data?.message, { type: "success" });
    },
  });
};

export const useDeleteBlog = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteBlog({ id }),
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEYS.BLOGS);
      showToast(data?.message, { type: "success" });
    },
  });
};
