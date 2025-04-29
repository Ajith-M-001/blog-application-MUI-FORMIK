import { useQuery } from "@tanstack/react-query";
import { tagServices } from "../../api/services/tags";

export const QUERY_KEYS = {
  TAGS: ["tags"],
  TAG: (tagId) => ["tag", tagId],
};

export const useGetAllTags = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.TAGS,
    queryFn: ({ signal }) => tagServices.getAllTags({ signal }),
    ...options,
  });
};
