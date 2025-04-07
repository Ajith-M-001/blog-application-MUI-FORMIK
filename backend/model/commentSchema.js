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
    parent: {
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
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Store references to replies to this comment
        default: [],
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0, // 0 for parent comments, 1 for first-level replies, 2 for second-level replies
    },
  },
  {
    timestamps: true,
  }
);

// Indexing the blog and parent fields for faster lookups
commentSchema.index({ parent: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
