import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      unique: [true, "Tag name should be unique"],
    },
    slug: {
      type: String,
      trim: true,
      unique: [true, "slug should be unique"],
      match: [/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    analytics: {
      viewCount: {
        type: Number,
        default: 0,
        min: [0, "View count cannot be negative"],
      },
      uniqueViewCount: {
        type: Number,
        default: 0,
        min: [0, "View count cannot be negative"],
      },
      followerCount: {
        type: Number,
        default: 0,
        min: [0, "Follower count cannot be negative"],
      },
      postCount: {
        type: Number,
        default: 0,
        min: [0, "Post count cannot be negative"],
      },
      tagUsedCount: {
        type: Number,
        default: 0,
        min: [0, "Tag used count cannot be negative"],
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const tagModel = mongoose.model("Tag", tagSchema);
export default tagModel;
