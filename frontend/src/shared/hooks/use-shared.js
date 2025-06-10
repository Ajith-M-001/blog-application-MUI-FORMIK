import { useQuery } from "@tanstack/react-query";
import { SHARED_QUERY_KEYS } from "../Keys/sharedKeys";
import { getUserFollowingStatus } from "../api/shared.api";

export const useUserFollowingStatus = (userIdToCheck, options = {}) => {
  return useQuery({
    queryKey: [SHARED_QUERY_KEYS.USER_FOLLOWING_STATUS, userIdToCheck],
    queryFn: ({ signal }) => getUserFollowingStatus(userIdToCheck, signal),
    ...options,
  });
};
