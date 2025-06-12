import { axiosInstance } from "../../api/axiosClient";
import { USER_API_ENDPOINTS } from "./endpoints";

export const getUserFollowingStatus = async (userIdToCheck, signal) => {
  const { data } = await axiosInstance.get(USER_API_ENDPOINTS.CHECK_FOLLOWING, {
    signal,
    params: { userIdToCheck },
  });
  return data;
};

export const followUser = async (userIdToFollow, signal) => {
  const { data } = await axiosInstance.put(
    USER_API_ENDPOINTS.FOLLOW,
    { userIdToFollow },
    { signal }
  );
  return data;
};

export const unfollowUser = async (userIdToUnfollow, signal) => {
  const { data } = await axiosInstance.put(
    USER_API_ENDPOINTS.UNFOLLOW,
    { userIdToUnfollow },
    { signal }
  );
  return data;
};
