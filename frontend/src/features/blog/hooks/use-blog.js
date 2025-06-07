import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "../keys/queryKey";
import {
  deleteBlog,
  getAllBlogs,
  getAllCategory,
  getAllTags,
  getBlogBySlug,
  getPersonalizedBlogs,
  getPopularCategory,
  getTrendingBlogs,
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
    mutationFn: publishBlog,
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEYS.BLOGS);
      showToast(data?.message, { type: "success" });
    },
  });
};

export const useGetAllBlogs = (options = {}, params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BLOGS, params],
    queryFn: ({ signal }) => getAllBlogs({ signal, params }),
    ...options,
  });
};

export const useInfiniteGetAllBlogs = (options = {}, params = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.INFINITE_BLOGS, params], // Include params in queryKey to ensure cache uniqueness
    queryFn: ({ signal, pageParam }) =>
      getAllBlogs({
        signal,
        params: { ...params, cursor: pageParam }, // Merge cursor with params
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor ?? undefined,
    ...options,
  });
};

export const useGetBlogBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BLOG(slug),
    queryFn: ({ signal }) => getBlogBySlug({ slug, signal }),
    ...options,
  });
};

export const useUpdateBlog = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blogData }) => updateBlog({ id, blogData }),
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.BLOGS);
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

export const useGetPersonalizedBlogs = (options = {}, params = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PERSONALIZED_BLOGS, params], // Include params in queryKey to ensure cache uniqueness
    queryFn: ({ signal, pageParam }) =>
      getPersonalizedBlogs({
        signal,
        params: { ...params, cursor: pageParam }, // Merge cursor with params
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor ?? undefined,
    ...options,
  });
};

export const useGetTrendingBlogs = (options = {}, params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRENDING_BLOGS, params], // Include params in queryKey to ensure cache uniqueness
    queryFn: ({ signal }) => getTrendingBlogs({ signal, params }),
    ...options,
  });
};

export const useGetPopularCategories = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.POPULAR_CATEGORIES,
    queryFn: ({ signal }) => getPopularCategory({ signal }),
    ...options,
  });
};
