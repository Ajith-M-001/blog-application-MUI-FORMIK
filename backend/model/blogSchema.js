import mongoose from "mongoose";
import { BLOG_STATUS } from "../../common/constants/constants.js";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
      minlength: [5, "Title must be at least 5 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Content is required"],
      minlength: [100, "Content must be at least 100 characters"],
    },
    description: {
      type: String,
      required: [true, "SEO description is required"],
      maxlength: [160, "SEO description cannot exceed 160 characters"],
      trim: true,
    },
    coverImage: {
      url: {
        type: String,
        required: [true, "Cover image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Cover image public ID is required"],
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.DRAFT,
    },
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
    scheduleDateAndTime: {
      type: Date,
      default: null,
    },
    readingTime: {
      minutes: {
        type: Number,
        default: 0,
      },
      words: {
        type: Number,
        default: 0,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    publishedAt: {
      type: Date,
      default: null,
    },
    blogActivity: {
      total_views: {
        type: Number,
        default: 0,
      },
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_shares: {
        type: Number,
        default: 0,
      },
      total_bookmarks: {
        type: Number,
        default: 0,
      },
      total_replies: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ title: "text", description: "text" });
blogSchema.index({ status: 1, createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
