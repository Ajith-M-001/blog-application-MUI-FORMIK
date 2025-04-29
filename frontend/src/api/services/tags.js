// frontend/src/api/services/tagServices.js

import { axiosInstance } from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const tagServices = {
  getAllTags: async ({ signal }) => {
    const response = await axiosInstance.get(API_ENDPOINTS.tags.all, {
      signal,
    });
    return response.data;
  },
};
