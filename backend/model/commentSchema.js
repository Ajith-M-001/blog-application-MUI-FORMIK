import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    mentions: [
      {
        _id: false,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    isPinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexing the blog and parent fields for faster lookups
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
