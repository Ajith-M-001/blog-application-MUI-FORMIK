//frontend\src\hooks\api\countries.js

import { useQuery } from "@tanstack/react-query";
import { countryServices } from "../../api/services/countries";

export const QUERY_KEYS = {
  COUNTRIES: ["countries"],
  COUNTRY: (countryId) => ["country", countryId],
};
export const useGetAllCountry = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COUNTRIES,
    queryFn: countryServices.getAllCountry,
  });
};
