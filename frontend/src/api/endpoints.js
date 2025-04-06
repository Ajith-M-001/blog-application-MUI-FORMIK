//frontend\src\api\endpoints.js

const USER_URL = "/users";
const COUNTRY_URL = "/countries";
export const API_ENDPOINTS = {
  users: {
    signUp: `${USER_URL}/sign-up`,
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
};
