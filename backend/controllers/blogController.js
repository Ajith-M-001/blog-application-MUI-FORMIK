import { BLOG_STATUS, NOTIFICATION_TYPES } from "../constants/constants.js";
import Blog from "../model/blogSchema.js";
import userModel from "../model/user.schema.js";
import pushNotificationService from "../services/notification/PushNotificationService.js";
import { redisService } from "../services/redis/cacheService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler, transactionHandler } from "../utils/AsyncHandler.js";
import { generateSlug } from "../utils/generateSlug.js";
import { createNotification } from "./notificationController.js";

export const getPersonalizedBlogs = asyncHandler(async (req, res) => {
  const { cursor = null, limit = 10 } = req.query;
  const userId = req.user._id;

  const user = await userModel
    .findById(userId)
    .select("followingCategories followingTags following likedBlogs")
    .lean();

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  let query = {
    status: "published",
    $or: [
      { category: { $in: user.followingCategories } },
      { tags: { $in: user.followingTags } },
      { author: { $in: user.following } },
    ],
  };

  // Handle cursor-based pagination
  if (cursor) {
    let [timestamp, id] = cursor.split("_");
    query = {
      ...query,
      $or: [
        { createdAt: { $lt: new Date(parseInt(timestamp)) } },
        {
          createdAt: new Date(parseInt(timestamp)),
          _id: { $lt: id },
        },
      ],
    };
  }

  const cacheKey = `blogs:for-you:user=${userId}:cursor=${
    cursor || "first"
  }:limit=${limit}`;
  const cachedBlogs = await redisService.get(cacheKey);

  if (cachedBlogs) {
    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Personalized Blogs (cached)",
          JSON.parse(cachedBlogs)
        )
      );
  }

  // Fetch blogs with sorting by engagement (e.g., views, likes) and recency
  let blogs = await Blog.find(query)
    .select(
      "title description blogActivity author createdAt category coverImage slug status scheduleDateAndTime readingTime"
    )
    .sort({
      // "blogActivity.total_views": -1, // Prioritize high engagement
      createdAt: -1, // Then sort by recency
    })
    .populate("author", "username avatar")
    .populate("category", "name")
    .populate("tags", "name")
    .limit(Number(limit) + 1) // Fetch one extra to check for next page
    .lean();

  if (blogs.length < Number(limit)) {
    const additionalBlogs = await Blog.find({
      status: "published",
      _id: { $nin: blogs.map((b) => b._id) }, // Exclude already fetched blogs
    })
      .sort({ "blogActivity.total_views": -1, createdAt: -1 })
      .limit(Number(limit) - blogs.length + 1)
      .select(
        "title description blogActivity author createdAt category coverImage slug status scheduleDateAndTime readingTime"
      )
      .populate("author", "username avatar")
      .populate("category", "name")
      .populate("tags", "name")
      .lean();

    blogs = [...blogs, ...additionalBlogs];
  }

  const totalBlogs = await Blog.countDocuments({ status: "published" });

  const hasNextPage = blogs.length > Number(limit);
  if (hasNextPage) {
    blogs = blogs.slice(0, Number(limit));
  }

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

  await redisService.set(cacheKey, JSON.stringify(responsePayload), 600); // Cache for 10 minutes

  return res
    .status(200)
    .json(ApiResponse.success("Personalized Blogs", responsePayload));
});

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
    const savedBlog = await blog.save({ session });

    await userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { "account_info.total_posts": 1 },
        $set: { "account_info.last_post_date": new Date() },
      },
      { session }
    );

    if (status === BLOG_STATUS.PUBLISHED) {
      const author = await userModel
        .findById(userId)
        .select("followers firstName lastName avatar username")
        .session(session);

      if (author && author.followers.length > 0) {
        const notificationPromises = [];

        for (const followerId of author.followers) {
          notificationPromises.push(
            createNotification({
              recipient: followerId,
              sender: userId,
              type: NOTIFICATION_TYPES.NEW_BLOG_POST,
              title: "New blog published",
              message: `${author.firstName} ${author.lastName} published a new blog: ${title}`,
              blogId: savedBlog._id, // Keep blogId if needed elsewhere
              slug: savedBlog.slug,
            })
          );

          notificationPromises.push(
            pushNotificationService.sendPushNotification(followerId, {
              title: "New Blog Alert",
              message: `${author.firstName} ${author.lastName} just posted: ${title}`,
              blogId: savedBlog._id,
              slug: savedBlog.slug,
            })
          );
        }

        await Promise.all(notificationPromises);
      }
    }

    let message =
      status === BLOG_STATUS.PUBLISHED ? "Blog published successfully" : null;

    res.status(201).json(ApiResponse.created(blog, message, 201));
  }
);

export const getAllBlog = asyncHandler(async (req, res) => {
  const { cursor = null, limit = 10 } = req.query;

  let query = { status: "published" };

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

  const cacheKey = `blogs:cursor=${cursor || "first"}:limit=${limit}`;
  const cachedBlogs = await redisService.get(cacheKey);

  if (cachedBlogs) {
    return res
      .status(200)
      .json(ApiResponse.success("Blogs (cached)", JSON.parse(cachedBlogs)));
  }

  // Use 'let' for blogs to allow modifications below
  let blogs = await Blog.find(query)
    .select(
      "title description blogActivity author createdAt category coverImage slug status scheduleDateAndTime readingTime"
    )
    .sort({ createdAt: -1 })
    .populate("author", "username avatar")
    .populate("category", "name")
    .populate("tags", "name")
    .limit(Number(limit) + 1) // Request one extra document to check for next page
    .lean();

  const totalBlogs = await Blog.countDocuments({ status: "published" });
  const hasNextPage = blogs.length > Number(limit);

  // If there's an extra document, remove it to maintain the limit
  if (hasNextPage) {
    blogs = blogs.slice(0, Number(limit));
  }

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

  console.log("slug", slug);

  const cacheKey = `blogs:slug=${slug}`;
  const cachedBlog = await redisService.get(cacheKey);

  if (cachedBlog) {
    return res
      .status(200)
      .json(ApiResponse.success("Blog (cached)", JSON.parse(cachedBlog)));
  }

  const blog = await Blog.findOne({ slug })
    .populate("author", "username avatar firstName lastName")
    .populate("category", "name")
    .populate("tags", "name")
    .lean();

  if (!blog) {
    return res.status(404).json(ApiResponse.error("Blog not found", 404));
  }

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
      updateObject.publishedAt = new Date();
    }

    await redisService.clearCacheByPattern("blogs:*");

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateObject, {
      new: true,
      session,
    });

    return res
      .status(200)
      .json(ApiResponse.success("Blog updated successfully", updatedBlog, 200));
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

export const getTrendingBlogs = asyncHandler(async (req, res, next) => {
  const { limit = 5 } = req.query;
  // Define a time window, e.g., last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const cacheKey = `blogs:trending:limit=${limit}`;
  const cachedBlogs = await redisService.get(cacheKey);

  if (cachedBlogs) {
    return res
      .status(200)
      .json(
        ApiResponse.success("Trending Blogs (cached)", JSON.parse(cachedBlogs))
      );
  }

  const trendingBlogs = await Blog.find({
    status: BLOG_STATUS.PUBLISHED,
    createdAt: { $gte: sevenDaysAgo },
  })
    .sort({
      "blogActivity.total_views": -1, // Sort by most views
      "blogActivity.total_likes": -1, // Optionally sort by likes
      createdAt: -1, // Fallback to recency
    })
    .limit(Number(limit))
    .select("title  blogActivity.total_views  createdAt  coverImage")
    .lean();

  await redisService.set(cacheKey, JSON.stringify(trendingBlogs), 600); // Cache for 10 mins

  return res
    .status(200)
    .json(ApiResponse.success("Trending Blogs", trendingBlogs));
});
