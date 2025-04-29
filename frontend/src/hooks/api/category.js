import { useQuery } from "@tanstack/react-query";
import { categoryServices } from "../../api/services/category";

export const QUERY_KEYS = {
  CATEGORIES: ["categories"],
  CATEGORY: (countryId) => ["category", countryId],
};
export const useGetAllCategory = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: ({ signal }) => categoryServices.getAllCategory({ signal }),
    ...options,
  });
};
