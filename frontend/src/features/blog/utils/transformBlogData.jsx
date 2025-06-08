import { BLOG_STATUS } from "../../../shared/constants/constants";

export const transformBlogData = (blogData) => {
  return {
    _id: blogData?._id || null,
    slug: blogData?.slug || null,
    title: blogData?.title || "",
    coverImage: {
      url: blogData?.coverImage?.url || "",
      publicId: blogData?.coverImage?.public_id || "",
    },
    content: blogData?.content || null,
    category: blogData?.category || null,
    tags: blogData?.tags || [],
    description: blogData?.description || "",
    status: blogData?.status || BLOG_STATUS.DRAFT,
    scheduleDateAndTime: blogData?.scheduleDateAndTime || "",
    readingTime: {
      minutes: blogData?.readingTime?.minutes || 0,
      words: blogData?.readingTime?.words || 0,
    },
  };
};
