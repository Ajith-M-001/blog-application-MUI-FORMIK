import { axiosInstance } from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const countryServices = {
  getAllCountry: async ({ signal }) => {
    const response = await axiosInstance.get(API_ENDPOINTS.countries.all, {
      signal,
    });
    return response.data;
  },
};
