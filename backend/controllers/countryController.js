import { asyncHandler } from "../utils/AsyncHandler.js";
import { countries } from "../data/countries.js";

export const countriesList = asyncHandler(async (req, res) => {
  res.status(200).json(countries);
});
