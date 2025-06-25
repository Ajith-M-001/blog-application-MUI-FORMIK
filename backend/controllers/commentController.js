import Blog from "../model/blogSchema.js";
import Comment from "../model/commentSchema.js";
import userModel from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const SORT_OPTIONS = {
  top: { likesCount: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
};

export const addComment = asyncHandler(async (req, res, next) => {
  const { content, blogId, parentCommentId, replyTo } = req.body;
  const userId = req.user._id;

  if (!content || !blogId) {
    return res
      .status(400)
      .json(ApiResponse.error("Content and blog ID are required", 400));
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(400).json(ApiResponse.error("Blog not found", 400));
  }

  let parentComment = null;

  if (parentCommentId) {
    parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res
        .status(404)
        .json(ApiResponse.error("Parent comment not found", 400));
    }

    // Ensure parent comment belongs to the same blog
    if (parentComment.blog.toString() !== blogId) {
      return res
        .status(400)
        .json(
          ApiResponse.error("Parent comment does not belong to this blog", 400)
        );
    }
  }

  if (replyTo) {
    const user = await userModel.findById(replyTo);
    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found"));
    }
  }

  const newComment = new Comment({
    content,
    blog: blogId,
    author: userId,
    parentComment: parentCommentId || null,
    replyTo: replyTo || null,
  });

  await newComment.save();

  const populatedComment = await Comment.findById(newComment._id)
    .populate("author", "name email avatar")
    .populate("replyTo", "name")
    .populate("likes", "name");

  res
    .status(201)
    .json(
      ApiResponse.success("Comment created successfully", populatedComment, 201)
    );
});

export const getCommentsForBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  const sortKey = req.query.filter || "top";
  const limit = 3;

  const SORT_OPTIONS = {
    top: { likesCount: -1, createdAt: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  if (!(sortKey in SORT_OPTIONS)) {
    return res.status(400).json(ApiResponse.error("Invalid sort option", 400));
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(400).json(ApiResponse.error("Blog not found", 400));
  }
  const sortBy = SORT_OPTIONS[sortKey] || SORT_OPTIONS.top;

  return res.status(200).json({ message: blogId, sort: sortBy });
});
