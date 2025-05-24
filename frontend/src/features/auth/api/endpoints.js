const USER_URL = "/users";
const COUNTRY_URL = "/countries";
const API_BASE_URL = "/api"; // Assuming /api is a common base for new top-level endpoints

/**
 * @typedef {object} UserEndpoints
 * @property {string} signUp - Endpoint for user registration (specific to /users flow).
 * @property {string} signIn - Endpoint for user login.
 * @property {string} check - Endpoint for checking user authentication status.
 * @property {string} signOut - Endpoint for user logout.
 * @property {string} refreshToken - Endpoint for refreshing access token.
 * @property {string} verifyOtp - Endpoint for verifying OTP.
 * @property {string} resentOtp - Endpoint for resending OTP.
 * @property {string} forgotPassword - Endpoint for initiating password reset.
 * @property {string} getUserDetails - Endpoint for fetching user details.
 * @property {string} resetPassword - Endpoint for resetting password (authenticated).
 * @property {string} resetPasswordWithOTP - Endpoint for resetting password using OTP (unauthenticated).
 */

/**
 * @typedef {object} CountryEndpoints
 * @property {string} all - Endpoint for fetching all countries.
 */

/**
 * @typedef {object} RegistrationEndpoints
 * @property {string} submit - Endpoint for submitting new user registration data.
 */

/**
 * Collection of API endpoint paths used throughout the application.
 * Grouped by resource type (e.g., users, countries, registration).
 * @type {{users: UserEndpoints, countries: CountryEndpoints, registration: RegistrationEndpoints}}
 */
export const API_ENDPOINTS = {
  users: {
    signUp: `${USER_URL}/sign-up`, // This seems to be the existing one.
    signIn: `${USER_URL}/sign-in`,
    check: `${USER_URL}/check`,
    signOut: `${USER_URL}/sign-out`,
    refreshToken: `${USER_URL}/refresh`,
    verifyOtp: `${USER_URL}/verify-otp`,
    resentOtp: `${USER_URL}/resent-otp`,
    forgotPassword: `${USER_URL}/forgot-password`,
    getUserDetails: `${USER_URL}/get-user-details`,
    resetPassword: `${USER_URL}/reset-password`,
    resetPasswordWithOTP: `${USER_URL}/reset-password-with-otp`,
  },
  countries: {
    all: `${COUNTRY_URL}/all`,
  },
  // New endpoint for the RegisterForm submission
  registration: {
    submit: `${API_BASE_URL}/register`,
  },
};
