import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Full Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: (v) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v),
        message: "Password must include uppercase, lowercase, and numbers",
      },
    },
    // user name first it will be auto generated if user want they can change it
    userName: {
      type: String,
      unique: true,
      sparse: true,
      sparse: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_-]+$/.test(v);
        },
        message:
          "Username can only contain letters, numbers, underscores and hyphens",
      },
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },
    role: {
      type: [String],
      enum: ["super_admin", "admin", "author", "reader", "subscriber"],
      default: ["reader"],
    },
    //profile information
    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    profile_pic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/ajithm/image/upload/v1738989576/user-profile_suykqs.png",
      },
    },
    location: {
      type: String,
    },
    // OAuth Integration for Google Login
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    googleToken: { type: String },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    subscriptionHistory: [
      {
        plan: String,
        startDate: Date,
        endDate: Date,
        status: String,
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
      },
    ],

    // Account Verification
    isEmailVerified: { type: Boolean, default: false },
    verificationOTP: { type: Number, index: true },
    verificationOTPExpiry: { type: Date },

    // Password Reset
    resetPasswordOTP: { type: Number, index: true },
    resetPasswordOTPExpiry: { type: Date },
    passwordChangedAt: Date,
    previousPasswords: [String], // Store hashed passwords to prevent reuse

    // Social Media Links
    socialLinks: {
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      facebook: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
      X: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },

    // Activity Data
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followingTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    followingCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],

    // Blog Interaction
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
    drafts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
    publishedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],

    //User Accounts Statistics
    accountInfo: {
      totalPosts: { type: Number, default: 0 },
      totalReads: { type: Number, default: 0 },
      totalLikes: { type: Number, default: 0 },
      totalComments: { type: Number, default: 0 },
      postEngagementRate: { type: Number, default: 0 },
      viewsThisMonth: { type: Number, default: 0 },
      lastPostDate: { type: Date },
      revenueStats: {
        totalEarnings: { type: Number, default: 0 },
        thisMonthEarnings: { type: Number, default: 0 },
        paymentHistory: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
        ],
      },
    },
    // Security & Session Management
    refreshTokens: [
      {
        token: String,
        device: String,
        browser: String,
        ip: String,
        lastUsed: Date,
        expiresAt: Date,
      },
    ], // Storing JWT refresh tokens for session management

    // Notification Preferences
    notificationPreferences: {
      email: {
        newsletters: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
        followers: { type: Boolean, default: true },
        likes: { type: Boolean, default: true },
        reply: { type: Boolean, default: true },
      },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      emailFrequency: {
        type: String,
        enum: ["immediate", "daily", "weekly"],
        default: "immediate",
      },
    },

    // Activity Logs
    readingHistory: [
      {
        post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" },
        timestamp: { type: Date },
      },
    ],

    // Timestamps
    lastLogin: Date,
    lastActive: Date,
    loginHistory: [
      {
        timestamp: Date,
        ip: String,
        device: String,
        browser: String,
        location: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ userName: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });
userSchema.index({ verificationOTPExpiry: 1 }, { expireAfterSeconds: 0 });
userSchema.index({ resetPasswordOTPExpiry: 1 }, { expireAfterSeconds: 0 });

const userModel = mongoose.model("User", userSchema);

export default userModel;

// userSchema;

// blogSchema;

// commentSchema;

// categorySchema;

// tagSchema;

// subscriptionSchema;

// paymentSchema;

// notificationSchema;

// analyticsSchema;

// sessionSchema;

// newsletterSchema;
