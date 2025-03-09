//frontend\src\api\endpoints.js


const USER_URL = "/users";
export const API_ENDPOINTS = {
  users: {
    signUp: `${USER_URL}/sign-up`,
    signIn: `${USER_URL}/sign-in`,
    check: `${USER_URL}/check`,
    signOut: `${USER_URL}/sign-out`,
    refreshToken: `${USER_URL}/refresh`,
    verifyOtp: `${USER_URL}/verify-otp`,
  },
};
