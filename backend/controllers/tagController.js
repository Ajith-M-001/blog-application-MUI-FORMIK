import Tag from "../model/tagSchema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { generateSlug } from "../utils/generateSlug.js";

export const addTag = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return res
      .status(400)
      .json(ApiResponse.error("Tag name is required.", 400));
  }

  const existingTags = await Tag.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingTags) {
    return res
      .status(409)
      .json(ApiResponse.error("Category with this name already exists.", 409));
  }

  let tagsSlugBase = generateSlug(name);
  let finalSlug = tagsSlugBase;
  let slugExists = await Tag.findOne({ slug: finalSlug });
  let counter = 1;
  while (slugExists) {
    finalSlug = `${tagsSlugBase}-${counter}`;
    slugExists = await Tag.findOne({ slug: finalSlug });
    counter++;
  }

  const tags = new Tag({
    name,
    slug: finalSlug,
    description,
  });

  await tags.save();

  return res
    .status(201)
    .json(ApiResponse.created("Tag created successfully.", tags));
});
