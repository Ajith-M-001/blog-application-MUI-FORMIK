import { BLOG_STATUS } from "../constants/constants.js";
import Blog from "../model/blogSchema.js";
import Category from "../model/categorySchema.js";
import { redisService } from "../services/redis/cacheService.js";
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

export const getPopularCategories = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const cacheKey = `categories:popular:limit=${limit}`;
  const cachedCategories = await redisService.get(cacheKey);

  if (cachedCategories) {
    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Popular Categories (cached)",
          JSON.parse(cachedCategories)
        )
      );
  }

  const popularCategories = await Blog.aggregate([
    {
      $match: {
        status: BLOG_STATUS.PUBLISHED,
        category: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$category",
        totalBlogs: { $sum: 1 },
        totalViews: { $sum: "$blogActivity.total_views" },
        totalLikes: { $sum: "$blogActivity.total_likes" },
        totalComments: { $sum: "$blogActivity.total_comments" },
        latestBlogDate: { $max: "$createdAt" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $addFields: {
        engagementScore: {
          $add: [
            { $multiply: ["$totalViews", 1] },
            { $multiply: ["$totalLikes", 3] },
            { $multiply: ["$totalComments", 5] },
            { $multiply: ["$totalBlogs", 2] },
          ],
        },
      },
    },
    {
      $sort: {
        engagementScore: -1,
        totalBlogs: -1,
        latestBlogDate: -1,
      },
    },
    {
      $limit: Number(limit),
    },
    {
      $project: {
        _id: "$categoryInfo._id",
        name: "$categoryInfo.name",
        slug: "$categoryInfo.slug",
      },
    },
  ]);

  await redisService.set(cacheKey, JSON.stringify(popularCategories), 600);

  return res
    .status(200)
    .json(ApiResponse.success("Popular Categories", popularCategories));
});
