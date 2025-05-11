const CATEGORIES_URL = "/categories";
const TAGS_URL = "/tags";

export const API_ENDPOINTS = {
  blog: {},
  upload: {
    uploadImages: `/upload-images`,
    deleteImage: `/delete-image`,
  },
  categories: {
    all: `${CATEGORIES_URL}/all`,
  },
  tags: {
    all: `${TAGS_URL}/all`,
  },
};
