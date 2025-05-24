import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getAllCountry,
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

/**
 * @typedef {import('@tanstack/react-query').UseMutationOptions} UseMutationOptions
 * @typedef {import('@tanstack/react-query').UseQueryOptions} UseQueryOptions
 * @typedef {import('@tanstack/react-query').UseMutationResult} UseMutationResult
 * @typedef {import('@tanstack/react-query').UseQueryResult} UseQueryResult
 */

/**
 * Hook for user sign-up.
 * Uses React Query's useMutation to handle the sign-up process.
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: signUp, isLoading, error } = useSignUpUser();
 * signUp(userData);
 */
export const useSignUpUser = (options = {}) => {
  return useMutation({
    mutationFn: signUpUser,
    ...options,
  });
};

/**
 * Hook for user sign-in.
 * Uses React Query's useMutation to handle the sign-in process.
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: signIn, isLoading, error } = useSignInUser();
 * signIn(credentials);
 */
export const useSignInUser = (options = {}) => {
  return useMutation({
    mutationFn: signInUser,
    ...options,
  });
};

/**
 * Hook for user sign-out.
 * Uses React Query's useMutation to handle the sign-out process.
 * On success, it removes all queries related to authentication from the cache.
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: signOut } = useSignOutUser();
 * signOut();
 */
export const useSignOutUser = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOutUser,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.ALL });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook for verifying OTP (One-Time Password).
 * Uses React Query's useMutation to handle the OTP verification process.
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: verify, isLoading } = useVerifyOtp();
 * verify({ emailOrPhone: 'test@example.com', otp: '123456' });
 */
export const useVerifyOtp = (options = {}) => {
  return useMutation({
    mutationFn: verifyOtp,
    ...options,
  });
};

/**
 * Hook for initiating the forgot password process.
 * Sends a request to the backend to start password recovery (e.g., send OTP).
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: requestPasswordReset } = useForgotPassword();
 * requestPasswordReset({ email: 'user@example.com' });
 */
export const useForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
};

/**
 * Hook for resending OTP.
 * Useful if the user didn't receive the initial OTP or it expired.
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: resendOtp } = useResendOTP();
 * resendOtp({ emailOrPhone: 'user@example.com' });
 */
export const useResendOTP = (options = {}) => {
  return useMutation({
    mutationFn: resentOtp, // Assuming 'resentOtp' is the correct function name from API
    ...options,
  });
};

/**
 * Hook for fetching current user details.
 * Uses React Query's useQuery to fetch and cache user data.
 *
 * @param {UseQueryOptions} [options={}] - Optional React Query query options.
 * @returns {UseQueryResult} The result object from useQuery.
 * @example
 * const { data: user, isLoading } = useGetUserDetails();
 * if (user) {
 *   console.log(user.firstName);
 * }
 */
export const useGetUserDetails = (options = {}) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.USER_DETAILS,
    queryFn: getUserDetails,
    ...options,
  });
};

/**
 * Hook for resetting password (typically when user is already authenticated and wants to change password).
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: changePassword } = useResetPassword();
 * changePassword({ oldPassword: 'old', newPassword: 'new' });
 */
export const useResetPassword = (options = {}) => {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
};

/**
 * Hook for resetting password using OTP (typically for unauthenticated users who forgot their password).
 *
 * @param {UseMutationOptions} [options={}] - Optional React Query mutation options.
 * @returns {UseMutationResult} The result object from useMutation.
 * @example
 * const { mutate: resetPassWithOtp } = useResetPasswordWithOTP();
 * resetPassWithOtp({ emailOrPhone: 'test@example.com', otp: '123456', newPassword: 'newSecurePassword' });
 */
export const useResetPasswordWithOTP = (options = {}) => {
  return useMutation({
    mutationFn: resetPasswordWithOTP,
    ...options,
  });
};

/**
 * Hook for fetching a list of all countries.
 * Typically used for country code selectors in forms.
 * Passes the signal from queryFn to getAllCountry for cancellable requests.
 *
 * @param {UseQueryOptions} [options={}] - Optional React Query query options.
 * @returns {UseQueryResult} The result object from useQuery.
 * @example
 * const { data: countries, isLoading } = useGetAllCountry();
 * if (countries) {
 *   // populate selector
 * }
 */
export const useGetAllCountry = (options = {}) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.COUNTRIES,
    queryFn: ({ signal }) => getAllCountry({ signal }),
    ...options,
  });
};
