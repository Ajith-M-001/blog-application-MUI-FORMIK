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

export const useSignUpUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.signUpUser,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error signing up user", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.verifyOtp,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error verifying otp", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useResentOTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.resentOtp,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error resending otp", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useSignInUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.signInUser,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error signing in user", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useGetUserDetails = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_DETAILS,
    queryFn: usersService.getUserDetails,
    onError: (error) => {
      console.log("Error getting user details", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useSignOutUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.signOutUser,
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.log("Error signing out user", error);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.forgotPassword,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error forgot password", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};

export const useCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CHECK,
    queryFn: usersService.checkUser,
    onError: (error) => {
      console.log("Error checking user", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};
