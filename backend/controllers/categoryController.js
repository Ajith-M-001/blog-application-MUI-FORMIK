import Category from "../model/categorySchema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { generateSlug } from "../utils/generateSlug.js";

export const addCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required." });
  }

  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingCategory) {
    return res
      .status(409)
      .json(ApiResponse.conflict("Category with this name already exists."));
  }

  let categorySlugBase = generateSlug(name);
  let finalSlug = categorySlugBase;
  let slugExists = await Category.findOne({ slug: finalSlug });
  let counter = 1;
  while (slugExists) {
    finalSlug = `${categorySlugBase}-${counter}`;
    slugExists = await Category.findOne({ slug: finalSlug });
    counter++;
  }

  const category = new Category({
    name,
    slug: finalSlug,
    description,
  });

  await category.save();

  return res
    .status(201)
    .json(ApiResponse.created("Category created successfully.", category));
});

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().select("name");
  return res
    .status(200)
    .json(
      ApiResponse.success("Categories found successfully.", categories, 200)
    );
});
