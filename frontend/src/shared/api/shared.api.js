import { axiosInstance } from "../../api/axiosClient";
import { USER_API_ENDPOINTS } from "./endpoints";

export const getUserFollowingStatus = async (userIdToCheck, signal) => {
  const { data } = await axiosInstance.get(USER_API_ENDPOINTS.CHECK_FOLLOWING, {
    signal,
    params: { userIdToCheck },
  });
  return data;
};
