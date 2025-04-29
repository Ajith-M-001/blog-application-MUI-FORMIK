import { axiosInstance } from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const categoryServices = {
  getAllCategory: async ({ signal }) => {
    const response = await axiosInstance.get(API_ENDPOINTS.categories.all, {
      signal,
    });
    return response.data;
  },
};
