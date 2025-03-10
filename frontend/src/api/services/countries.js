import { axiosInstance } from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const countryServices = {
  getAllCountry: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.countries.all);
    return response.data;
  },
};
