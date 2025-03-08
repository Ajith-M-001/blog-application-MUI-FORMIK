import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../api/services/users";

export const QUERY_KEYS = {
  USERS: ["users"],
  USER: (userId) => ["user", userId],
};

export const useSignUpUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return usersService.signUpUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.USERS);
    },
  });
};
