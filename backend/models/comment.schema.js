import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      maxlength: [150, "Comment can't be more than 150 characters"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    blogPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      // Compound index for common query patterns
      { blogPost: 1, createdAt: -1 }, // Get comments for post with sorting
      { parentComment: 1, createdAt: -1 }, // Nested replies with sorting
      { author: 1, blogPost: 1 }, // User's comments on specific post
      { createdAt: -1 }, // Recent comments first
      { level: 1 }, // For filtering top-level comments
    ],
  }
);

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
