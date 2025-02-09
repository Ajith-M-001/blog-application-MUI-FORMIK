import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "draft",
      index: true,
    },
    scheduledDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return !(this.status === "scheduled" && !v);
        },
        message: "Scheduled date is required for scheduled posts",
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true,
        required: true,
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        index: true,
      },
    ],
    banner: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        validate: {
          validator: function (v) {
            return (
              (this.status === "published" || this.status === "scheduled") &&
                !v,
              "Banner is required for published and scheduled posts"
            );
          },
        },
      },
    },
    seo: {
      metaTitle: {
        type: String,
        trim: true,
      },
      metaDescription: {
        type: String,
        maxlength: [200, "Meta description cannot exceed 200 characters"],
        trim: true,
      },
      keywords: {
        type: [String],
        trim: true,
        default: [],
      },
      ogImage: {
        public_id: String,
        url: String,
      },
    },
    readingTime: {
      minutes: {
        type: Number,
        default: 0,
        min: [0, "Reading time cannot be negative"],
      },
      words: {
        type: Number,
        default: 0,
        min: [0, "Word count cannot be negative"],
      },
    },
    versions: [
      {
        content: mongoose.Schema.Types.Mixed,
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Engagement
    engagement: {
      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
      bookmarkedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          index: true,
        },
      ],
      likedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          index: true,
        },
      ],
    },
    // Analytics and Metrics
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      uniqueViews: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      bookmarks: {
        type: Number,
        default: 0,
      },
    },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
    isFeaturePost: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    featuredUntil: Date, // For scheduled featuring
    userEngagement: {
      devices: {
        mobile: { type: Number, default: 0 },
        desktop: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 },
      },
      locations: [
        {
          country: String,
          region: String,
          count: { type: Number, default: 0 },
        },
      ],
    },
  },
  {
    timestamps: true,
    indexes: [
      { title: "text", content: "text" },
      { createdAt: -1 },
      { "analytics.views": -1 },
      { status: 1 },
    ],
  }
);

const BlogPostModel = mongoose.model("BlogPost", blogPostSchema);

export default BlogPostModel;
