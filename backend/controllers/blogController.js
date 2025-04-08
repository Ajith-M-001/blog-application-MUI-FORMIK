import { BLOG_STATUS } from "../../common/constants/constants.js";
import Blog from "../model/blogSchema.js";
import userModel from "../model/user.schema.js";
import { redisService } from "../services/redis/cacheService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler, transactionHandler } from "../utils/AsyncHandler.js";
import { generateSlug } from "../utils/generateSlug.js";

export const publishBlog = transactionHandler(
  async (req, res, next, session) => {
    const {
      title,
      content,
      category,
      tags,
      description,
      coverImage,
      status,
      slug,
      scheduleDateAndTime,
      readingTime,
    } = req.body;
    const userId = req.user._id;

    if (!title || !content || !category || !description || !coverImage) {
      return res
        .status(400)
        .json(ApiResponse.error("All required fields must be provided.", 400));
    }

    if (!Object.values(BLOG_STATUS).includes(status)) {
      return res
        .status(400)
        .json(ApiResponse.error("Invalid blog status.", 400));
    }

    if (status === BLOG_STATUS.SCHEDULED && !scheduleDateAndTime) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Schedule date and time is required for scheduled blogs.",
            400
          )
        );
    }

    const scheduleDate = new Date(scheduleDateAndTime);
    if (scheduleDate < new Date()) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Schedule date and time must be in the future.",
            400
          )
        );
    }

    if (tags && !Array.isArray(tags)) {
      return res.status(400).json(ApiResponse.error("Tags must be an array"));
    }

    let blogSlugBase = generateSlug(title);
    let finalSlug = blogSlugBase;
    let slugExists = await Blog.findOne({ slug: finalSlug });
    let counter = 1;
    while (slugExists) {
      finalSlug = `${blogSlugBase}-${counter}`;
      slugExists = await Blog.findOne({ slug: finalSlug });
      counter++;
    }

    const blog = new Blog({
      title,
      content,
      category,
      tags,
      description,
      coverImage,
      status,
      slug: finalSlug,
      scheduleDateAndTime,
      readingTime,
      author: userId,
      publishedAt: status === BLOG_STATUS.PUBLISHED ? new Date() : null,
    });

    await blog.save({ session });

    await userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { "account_info.total_posts": 1 },
        $set: { "account_info.last_post_date": new Date() },
      },
      { session }
    );

    let message =
      status === BLOG_STATUS.PUBLISHED ? "Blog published successfully" : null;

    res.status(201).json(ApiResponse.created(blog, message, 201));
  }
);

export const getAllBlog = asyncHandler(async (req, res) => {
  const cacheKey = "allBlogs";
  const cachedBlogs = await redisService.get(cacheKey);
  if (cachedBlogs) {
    return res
      .status(200)
      .json(ApiResponse.success("All Blogs (cached)", cachedBlogs));
  }
  const blogs = await Blog.find()
    .select("title description author createdAt")
    .sort({ createdAt: -1 })
    .populate("author", "username profile_image")
    .populate("category", "name")
    .limit(10)
    .lean();
  await redisService.set(cacheKey, blogs, 600);
  res.status(200).json(ApiResponse.success("All Blogs", blogs));
});
