import { axiosInstance } from "../../../api/axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const signUpUser = async (userData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.users.signUp,
    userData
  );
  return data;
};

export const signInUser = async (userData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.users.signIn,
    userData
  );
  return data;
};

export const signOutUser = async () => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.users.signOut);
  return data;
};

export const refreshAccessToken = async () => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.users.refreshToken);
  return data;
};

export const verifyOtp = async (verificationData) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.verifyOtp,
    verificationData
  );
  return data;
};

export const forgotPassword = async (contact) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.forgotPassword,
    contact
  );
  return data;
};

export const resentOtp = async (contact) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.resentOtp,
    contact
  );
  return data;
};

export const getUserDetails = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.users.getUserDetails);
  return data;
};

export const resetPassword = async (resetData) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.resetPassword,
    resetData
  );
  return data;
};

export const resetPasswordWithOTP = async (resetData) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.resetPasswordWithOTP,
    resetData
  );
  return data;
};

export const getAllCountry = async ({ signal }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.countries.all, {
    signal,
  });
  return response.data;
};
