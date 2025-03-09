//frontend\src\hooks\api\Users.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../api/services/users";
import { showToast } from "../../utils/toast";

export const QUERY_KEYS = {
  USERS: ["users"],
  USER: (userId) => ["user", userId],
};

export const useSignUpUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.signUpUser,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
    onError: (error) => {
      console.log("Error signing up user", error?.response?.data);
      showToast(error?.response?.data?.message, { type: "error" });
    },
  });
};
