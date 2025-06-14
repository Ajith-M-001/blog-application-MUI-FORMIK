import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SHARED_QUERY_KEYS } from "../Keys/sharedKeys";
import { showToast } from "../../shared/utils/toast";
import {
  followUser,
  getUserFollowingStatus,
  unfollowUser,
} from "../api/shared.api";

export const useUserFollowingStatus = (userIdToCheck, options = {}) => {
  return useQuery({
    queryKey: [SHARED_QUERY_KEYS.USER_FOLLOWING_STATUS, userIdToCheck],
    queryFn: ({ signal }) => getUserFollowingStatus(userIdToCheck, signal),
    ...options,
  });
};

// Hook to follow a user
export const useFollowUser = (userIdToCheck) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIdToFollow, signal }) =>
      followUser(userIdToFollow, signal),
    onSuccess: (response) => {
      showToast(response?.message, { type: "success" });
      // Invalidate the query to refresh following status
      queryClient.invalidateQueries({
        queryKey: [SHARED_QUERY_KEYS.USER_FOLLOWING_STATUS, userIdToCheck],
      });
    },
  });
};

// Hook to unfollow a user
export const useUnfollowUser = (userIdToCheck) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIdToUnfollow, signal }) =>
      unfollowUser(userIdToUnfollow, signal),
    onSuccess: (response) => {
      showToast(response?.message, { type: "success" });
      // Invalidate the query to refresh following status
      queryClient.invalidateQueries({
        queryKey: [SHARED_QUERY_KEYS.USER_FOLLOWING_STATUS, userIdToCheck],
      });
    },
  });
};
