//frontend\src\hooks\api\Users.js

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../api/services/users";
import { showToast } from "../../utils/toast";

export const QUERY_KEYS = {
  USERS: ["users"],
  USER: (userId) => ["user", userId],
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
    queryKey: QUERY_KEYS.USERS,
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
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error signing out user", error);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};
