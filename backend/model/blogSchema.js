import mongoose from "mongoose";
import { BLOG_STATUS } from "../constants/constants.js";
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    content: { type: mongoose.Schema.Types.Mixed },
    description: { type: String, trim: true },
    coverImage: {
      url: { type: String },
      publicId: { type: String },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // index: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.DRAFT,
    },
    scheduleDateAndTime: { type: Date, default: null },
    readingTime: {
      minutes: { type: Number, default: 0 },
      words: { type: Number, default: 0 },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    publishedAt: { type: Date, default: null },
    blogActivity: {
      total_views: { type: Number, default: 0 },
      total_likes: { type: Number, default: 0 },
      total_comments: { type: Number, default: 0 },
      total_shares: { type: Number, default: 0 },
      total_bookmarks: { type: Number, default: 0 },
      total_replies: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", description: "text" });
blogSchema.index({ status: 1, createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
