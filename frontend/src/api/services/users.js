//frontend\src\api\services\users.js

import { axiosInstance } from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const usersService = {
  signUpUser: async (userData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.users.signUp,
      userData
    );
    return response.data;
  },

  signInUser: async (userData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.users.signIn,
      userData
    );
    return response.data;
  },

  signOutUser: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.users.signOut);
    return response.data;
  },

  refreshAccessToken: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.users.refreshToken);
    return response.data;
  },

  verifyOtp: async (verificationData) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.users.verifyOtp,
      verificationData
    );
    return response.data;
  },

  resentOtp: async (contact) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.users.resentOtp,
      contact
    );
    return response.data;
  },
};
