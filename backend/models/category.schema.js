import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name should be unique"],
      trim: true,
      index: true, // Index for better performance in search
    },
    slug: {
      type: String,
      trim: true,
      unique: [true, "Slug should be unique"],
      index: true,
      match: [/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"],
    },
    blogpost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
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
      categoryUsedCount: {
        type: Number,
        default: 0,
        min: [0, "Post count cannot be negative"],
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, "Meta title cannot exceed 60 characters"], // Limit for meta title
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, "Meta description cannot exceed 160 characters"], // Limit for meta description
      },
      keywords: [String], // Array of SEO keywords
      ogImage: {
        public_id: String,
        url: String,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Define compound and individual indexes for better query performance
categorySchema.index({ categoryName: "text", description: "text" }); // Full-text search on categoryName and description
categorySchema.index({ "analytics.viewCount": -1 }); // Index for sorting by viewCount (e.g., for popular categories)
categorySchema.index({ slug: 1 }); // Index on slug for quick lookup

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
