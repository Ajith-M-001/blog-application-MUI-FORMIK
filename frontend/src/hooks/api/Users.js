//frontend\src\hooks\api\Users.js

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../api/services/users";
import { showToast } from "../../utils/toast";

export const QUERY_KEYS = {
  USERS: ["users"],
  USER: (userId) => ["user", userId],
  CHECK: ["check"],
  USER_DETAILS: ["user-details"],
};

export const useSignUpUser = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.signUpUser,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error signing up user", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useVerifyOtp = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.verifyOtp,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error verifying otp", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useResentOTP = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.resentOtp,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error resending otp", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useSignInUser = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.signInUser,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error signing in user", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useGetUserDetails = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_DETAILS,
    queryFn: usersService.getUserDetails,
    ...options,
    onError: (error) => {
      console.log("Error getting user details", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useSignOutUser = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.signOutUser,
    ...options,
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.log("Error signing out user", error);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useForgotPassword = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.forgotPassword,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error forgot password", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useCheck = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHECK,
    queryFn: usersService.checkUser,
    ...options,
    onError: (error) => {
      console.log("Error checking user", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useResetPassword = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.resetPassword,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error resetting password", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useResetPasswordWithOTP = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.resetPasswordWithOTP,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error resetting password", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};
