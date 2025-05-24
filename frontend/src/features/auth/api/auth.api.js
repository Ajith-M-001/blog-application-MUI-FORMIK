import { axiosInstance } from "../../../api/axiosClient";
import { API_ENDPOINTS } from "./endpoints";

/**
 * Registers a new user.
 * @async
 * @param {object} userData - The user registration data.
 * @param {string} userData.firstName - User's first name.
 * @param {string} userData.lastName - User's last name.
 * @param {string} [userData.email] - User's email address (if signing up with email).
 * @param {string} [userData.phoneNumber] - User's phone number (if signing up with phone).
 * @param {object} [userData.country] - User's country details (if signing up with phone).
 * @param {string} userData.password - User's password.
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.signUp}
 */
export const signUpUser = async (userData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.users.signUp,
    userData
  );
  return data;
};

/**
 * Signs in an existing user.
 * @async
 * @param {object} userData - The user login data.
 * @param {string} [userData.email] - User's email address (if signing in with email).
 * @param {string} [userData.phoneNumber] - User's phone number (if signing in with phone).
 * @param {string} userData.password - User's password.
 * @returns {Promise<any>} A promise that resolves with the API response data, typically including tokens and user info.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.signIn}
 */
export const signInUser = async (userData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.users.signIn,
    userData
  );
  return data;
};

/**
 * Signs out the current user.
 * @async
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.signOut}
 */
export const signOutUser = async () => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.users.signOut);
  return data;
};

/**
 * Refreshes the access token using a refresh token.
 * This function is typically called by an Axios interceptor when an API request fails due to an expired access token.
 * @async
 * @returns {Promise<any>} A promise that resolves with the API response data, containing the new access token.
 * @throws {Error} If the API request fails (e.g., refresh token is invalid or expired).
 * @see {@link API_ENDPOINTS.users.refreshToken}
 */
export const refreshAccessToken = async () => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.users.refreshToken);
  return data;
};

/**
 * Verifies an OTP (One-Time Password) for a user.
 * @async
 * @param {object} verificationData - Data required for OTP verification.
 * @param {string} verificationData.emailOrPhone - The email or phone number associated with the OTP.
 * @param {string} verificationData.otp - The OTP entered by the user.
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.verifyOtp}
 */
export const verifyOtp = async (verificationData) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.verifyOtp,
    verificationData
  );
  return data;
};

/**
 * Initiates the forgot password process for a user.
 * Typically sends an OTP to the user's registered email or phone.
 * @async
 * @param {object} contact - User's contact information.
 * @param {string} contact.emailOrPhone - The email or phone number to send reset instructions to.
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.forgotPassword}
 */
export const forgotPassword = async (contact) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.forgotPassword,
    contact
  );
  return data;
};

/**
 * Resends an OTP to the user.
 * @async
 * @param {object} contact - User's contact information.
 * @param {string} contact.emailOrPhone - The email or phone number to resend OTP to.
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.resentOtp}
 */
export const resentOtp = async (contact) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.resentOtp,
    contact
  );
  return data;
};

/**
 * Fetches details for the currently authenticated user.
 * @async
 * @returns {Promise<any>} A promise that resolves with the user details.
 * @throws {Error} If the API request fails (e.g., user not authenticated).
 * @see {@link API_ENDPOINTS.users.getUserDetails}
 */
export const getUserDetails = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.users.getUserDetails);
  return data;
};

/**
 * Resets the password for an authenticated user (changing their current password).
 * @async
 * @param {object} resetData - Data required for password reset.
 * @param {string} resetData.oldPassword - The user's current password.
 * @param {string} resetData.newPassword - The new password to set.
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.resetPassword}
 */
export const resetPassword = async (resetData) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.resetPassword,
    resetData
  );
  return data;
};

/**
 * Resets the password for a user using an OTP (typically for password recovery).
 * @async
 * @param {object} resetData - Data required for OTP-based password reset.
 * @param {string} resetData.emailOrPhone - The email or phone associated with the OTP.
 * @param {string} resetData.otp - The OTP provided by the user.
 * @param {string} resetData.newPassword - The new password to set.
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.users.resetPasswordWithOTP}
 */
export const resetPasswordWithOTP = async (resetData) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.users.resetPasswordWithOTP,
    resetData
  );
  return data;
};

/**
 * Fetches a list of all countries.
 * Used for populating country selectors, e.g., for phone number input.
 * @async
 * @param {object} params - Parameters for the request.
 * @param {AbortSignal} [params.signal] - An AbortSignal to allow cancelling the request.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of country objects.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.countries.all}
 */
export const getAllCountry = async ({ signal }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.countries.all, {
    signal,
  });
  return response.data;
};

/**
 * Submits new user registration data to the /api/register endpoint.
 * This is typically used by a general registration form, distinct from
 * the /users/sign-up flow which might have different implications (e.g., immediate OTP).
 * @async
 * @param {object} formData - The registration form data.
 * @param {string} formData.firstName - User's first name.
 * @param {string} formData.lastName - User's last name.
 * @param {string} formData.email - User's email address.
 * @param {string} formData.password - User's password.
 * // Potentially formData.confirmPassword might be sent or might be handled client-side only.
 * // For now, assume the backend expects fields as per RegisterForm's initialValues.
 * @returns {Promise<any>} A promise that resolves with the API response data.
 * @throws {Error} If the API request fails.
 * @see {@link API_ENDPOINTS.registration.submit}
 */
export const submitRegistration = async (formData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.registration.submit,
    formData
  );
  return data;
};
