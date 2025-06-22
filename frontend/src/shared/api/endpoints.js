const USER_BASE_URL = "/users";
const NOTIFICATION_BASE_URL = "/notifications";

export const USER_API_ENDPOINTS = {
  CHECK_FOLLOWING: `${USER_BASE_URL}/is-following`,
  FOLLOW: `${USER_BASE_URL}/follow`,
  UNFOLLOW: `${USER_BASE_URL}/unfollow`,
  NOTIFICATION: {
    REGISTER_TOKEN: `${NOTIFICATION_BASE_URL}/register-token`,
  },
};
