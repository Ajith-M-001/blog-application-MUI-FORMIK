import { BLOG_STATUS } from "../constants/constants.js";
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

    let blogSlugBase = generateSlug(title);
    let finalSlug = blogSlugBase;
    let slugExists = await Blog.findOne({ slug: finalSlug });
    let counter = 1;
    while (slugExists) {
      finalSlug = `${blogSlugBase}-${counter}`;
      slugExists = await Blog.findOne({ slug: finalSlug });
      counter++;
    }

    // Construct blog object conditionally
    const blogData = {
      title,
      content,
      tags,
      description,
      coverImage,
      status,
      slug: finalSlug,
      scheduleDateAndTime,
      readingTime,
      author: userId,
      publishedAt: status === BLOG_STATUS.PUBLISHED ? new Date() : null,
    };

    // Only set category if it exists and is not an empty string
    if (category) {
      blogData.category = category._id;
    }

    const blog = new Blog(blogData);

    await redisService.clearCacheByPattern("blogs:*");
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
  const { cursor = null, limit = 10 } = req.query;

  console.log("cursor", cursor, limit);
  let query = {};

  // Handle cursor-based pagination
  if (cursor) {
    let [timestamp, id] = cursor.split("_");
    query = {
      $or: [
        { createdAt: { $lt: new Date(parseInt(timestamp)) } },
        {
          createdAt: new Date(parseInt(timestamp)),
          _id: { $lt: id },
        },
      ],
    };
  }

  console.log("query", query);

  const cacheKey = `blogs:cursor=${cursor || "first"}:limit=${limit}`;
  const cachedBlogs = await redisService.get(cacheKey);

  console.log("cacheKey", cacheKey);
  console.log("cachedBlogs", cachedBlogs);

  if (cachedBlogs) {
    return res
      .status(200)
      .json(ApiResponse.success("Blogs (cached)", JSON.parse(cachedBlogs)));
  }

  // Use 'let' for blogs to allow modifications below
  let blogs = await Blog.find(query)
    .select("title description author createdAt category coverImage slug")
    .sort({ createdAt: -1, _id: -1 }) // Compound sort is great for pagination
    .populate("author", "username avatar")
    .populate("category", "name")
    .populate("tags", "name")
    .limit(Number(limit) + 1) // Request one extra document to check for next page
    .lean();

  console.log("blogs", blogs);

  const totalBlogs = await Blog.countDocuments();

  const hasNextPage = blogs.length > Number(limit);

  // If there's an extra document, remove it to maintain the limit
  if (hasNextPage) {
    blogs = blogs.slice(0, Number(limit));
  }

  console.log("Processed blogs", blogs);

  // Compute next cursor only if there's a next page
  const nextCursor = hasNextPage
    ? `${blogs[blogs.length - 1].createdAt.getTime()}_${
        blogs[blogs.length - 1]._id
      }`
    : null;

  const responsePayload = {
    blogs,
    nextCursor,
    totalBlogs,
  };

  await redisService.set(cacheKey, JSON.stringify(responsePayload), 600); // Cache the full response

  return res
    .status(200)
    .json(ApiResponse.success("All Blogs", responsePayload));
});

export const getBlogBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  if (!slug) {
    return res
      .status(400)
      .json(ApiResponse.error("Blog slug is required", 400));
  }

  const cacheKey = `blogs:slug=${slug}`;
  const cachedBlog = await redisService.get(cacheKey);

  if (cachedBlog) {
    return res
      .status(200)
      .json(ApiResponse.success("Blog (cached)", JSON.parse(cachedBlog)));
  }

  const blog = await Blog.findOne({ slug })
    .populate("author", "username avatar")
    .populate("category", "name")
    .populate("tags", "name")
    .lean();

  if (!blog) {
    return res.status(404).json(ApiResponse.error("Blog not found", 404));
  }

  console.log("CHECK_BLOG", blog);

  // Increment view count
  await Blog.findByIdAndUpdate(blog._id, {
    $inc: { "blogActivity.total_views": 1 },
  });

  await redisService.set(cacheKey, JSON.stringify(blog), 600); // Cache the full blog

  return res.status(200).json(ApiResponse.success("Blog", blog));
});

export const updateBlog = transactionHandler(
  async (req, res, next, session) => {
    const { id } = req.params;
    const userId = req.user._id;
    const {
      title,
      content,
      category,
      tags,
      description,
      coverImage,
      status,
      scheduleDateAndTime,
      readingTime,
    } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json(ApiResponse.error("Blog not found", 404));
    }

    console.log("blog", blog.author.toString(), userId.toString());
    if (blog.author.toString() !== userId.toString()) {
      return res
        .status(401)
        .json(
          ApiResponse.error("You are not authorized to update this blog", 401)
        );
    }

    let finalSlug = blog.slug;
    if (title && title !== blog.title) {
      let blogSlugBase = generateSlug(title);
      finalSlug = blogSlugBase;
      let slugExists = await Blog.findOne({
        slug: finalSlug,
        _id: { $ne: id },
      });
      let counter = 1;
      while (slugExists) {
        finalSlug = `${blogSlugBase}-${counter}`;
        slugExists = await Blog.findOne({ slug: finalSlug, _id: { $ne: id } });
        counter++;
      }
    }

    // Validate status if provided
    if (status && !Object.values(BLOG_STATUS).includes(status)) {
      return res
        .status(400)
        .json(ApiResponse.error("Invalid blog status", 400));
    }

    // Validate schedule date if status is SCHEDULED
    if (status === BLOG_STATUS.SCHEDULED) {
      if (!scheduleDateAndTime) {
        return res
          .status(400)
          .json(
            ApiResponse.error(
              "Schedule date and time is required for scheduled blogs",
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
              "Schedule date and time must be in the future",
              400
            )
          );
      }
    }

    // Validate tags if provided
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json(ApiResponse.error("Tags must be an array"));
    }

    //prepare update object
    const updateObject = {
      ...(title && { title }),
      ...(content && { content }),
      ...(category && { category }),
      ...(tags && { tags }),
      ...(description && { description }),
      ...(coverImage && { coverImage }),
      ...(status && { status }),
      ...(scheduleDateAndTime && { scheduleDateAndTime }),
      ...(readingTime && { readingTime }),
      ...(finalSlug && { slug: finalSlug }),
    };

    if (
      status === BLOG_STATUS.PUBLISHED &&
      blog.status !== BLOG_STATUS.PUBLISHED
    ) {
      updateData.publishedAt = new Date();
    }

    await redisService.clearCacheByPattern("blogs:*");

    await Blog.findByIdAndUpdate(id, updateObject, { new: true, session });

    return res
      .status(200)
      .json(ApiResponse.success("Blog updated successfully", 200));
  }
);

export const deleteBlog = transactionHandler(
  async (req, res, next, session) => {
    const { id } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json(ApiResponse.error("Blog not found", 404));
    }

    // Check if the user is the author of the blog
    if (blog.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json(
          ApiResponse.error("You are not authorized to delete this blog", 403)
        );
    }
    // Clear cache
    await redisService.clearCacheByPattern("blogs:*");

    // Delete blog
    await Blog.findByIdAndDelete(id, { session });

    // Update user's account_info
    await userModel.findByIdAndUpdate(
      userId,
      { $inc: { "account_info.total_posts": -1 } },
      { session }
    );

    return res
      .status(200)
      .json(ApiResponse.success("Blog deleted successfully", 200));
  }
);
