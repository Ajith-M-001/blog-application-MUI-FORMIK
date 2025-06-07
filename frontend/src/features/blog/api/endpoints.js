const CATEGORIES_URL = "/categories";
const TAGS_URL = "/tags";
const BLOGS_URL = "/blogs";

export const API_ENDPOINTS = {
  blogs: {
    publish: `${BLOGS_URL}/publish-blog`,
    all: `${BLOGS_URL}/all`,
    getBySlug: (slug) => `${BLOGS_URL}/${slug}`,
    update: (id) => `${BLOGS_URL}/${id}`,
    delete: (id) => `${BLOGS_URL}/${id}`,
    forYou: `${BLOGS_URL}/for_you`,
    trending: `${BLOGS_URL}/trending`,
  },
  upload: {
    uploadImages: `/upload-images`,
    deleteImage: `/delete-image`,
  },
  categories: {
    all: `${CATEGORIES_URL}/all`,
    popular: `${CATEGORIES_URL}/popular`,
  },
  tags: {
    all: `${TAGS_URL}/all`,
  },
};
