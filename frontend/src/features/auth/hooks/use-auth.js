import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getUserDetails,
  resentOtp,
  resetPassword,
  resetPasswordWithOTP,
  signInUser,
  signOutUser,
  signUpUser,
  verifyOtp,
} from "../api/auth.api";
import { AUTH_QUERY_KEYS } from "../keys/queryKeys";

export const useSignUpUser = (options = {}) => {
  return useMutation({
    mutationFn: signUpUser,
    ...options,
  });
};

export const useSignInUser = (options = {}) => {
  return useMutation({
    mutationFn: signInUser,
    ...options,
  });
};

export const useSignOutUser = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOutUser,
    ...options,
    onSuccess: () => {
      queryClient.removeQueries(AUTH_QUERY_KEYS.ALL);
    },
  });
};

export const useVerifyOtp = (options = {}) => {
  return useMutation({
    mutationFn: verifyOtp,
    ...options,
  });
};

export const useForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
};

export const useResendOTP = (options = {}) => {
  return useMutation({
    mutationFn: resentOtp,
    ...options,
  });
};

export const useGetUserDetails = (options = {}) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.USER_DETAILS,
    queryFn: getUserDetails,
    ...options,
  });
};

export const useResetPassword = (options = {}) => {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
};

export const useResetPasswordWithOTP = (options = {}) => {
  return useMutation({
    mutationFn: resetPasswordWithOTP,
    ...options,
  });
};
