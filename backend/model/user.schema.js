import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { SESSION_PREFERENCE, USER_ROLES } from "../constants/constants.js";

// refreshToken Schema
const refreshTokenSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    deviceInfo: {
      os: String,
      browser: String,
      ip: String,
      userAgent: String,
      lastLocation: String,
    },
    loggedInAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

// Auth Provider Schema
const authProviderSchema = new mongoose.Schema(
  {
    providerId: String,
    providerType: {
      type: String,
      enum: ["google", "facebook", "apple"],
    },
  },
  { _id: false }
);

const countrySchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    dial_code: String,
  },
  { _id: false }
);

const fcmTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    deviceInfo: {
      os: String,
      browser: String,
      ip: String,
      userAgent: String,
      lastLocation: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    country: countrySchema,
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    bio: { type: String },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    password: {
      type: String,
      required: function () {
        // Require password only if no social login provider is connected
        return !(this.authProviders && this.authProviders.length > 0);
      },
      select: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      public_id: {
        type: String, // Cloudinary's unique identifier for the uploaded image
        required: false, // Avatar is optional
        default: null,
      },
      url: {
        type: String, // The URL for the avatar image from Cloudinary
        required: false, // Avatar URL is optional
        default: null,
      },
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    followingCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    followingTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: { type: Number, default: 0 },
      total_reads: { type: Number, default: 0 },
      total_likes: { type: Number, default: 0 },
      total_comments: { type: Number, default: 0 },
      post_engagement_rate: { type: Number, default: 0 },
      views_this_month: { type: Number, default: 0 },
      last_post_date: { type: Date },
    },
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    roles: {
      type: [String],
      enum: Object.values(USER_ROLES),
      default: [USER_ROLES.READER],
    },
    sessionPreference: {
      type: String,
      enum: Object.values(SESSION_PREFERENCE),
      default: SESSION_PREFERENCE.MULTIPLE,
    },
    maxSession: { type: Number, default: 5, min: 1, max: 20 },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeExpires: {
      type: Date,
      select: false,
    },
    forgotPasswordCode: { type: String, select: false },
    forgotPasswordExpires: { type: Date, select: false },
    authProviders: { type: [authProviderSchema], select: false },
    refreshTokens: {
      type: [refreshTokenSchema],
      select: false,
      default: [],
    },
    fcmToken: {
      type: [fcmTokenSchema],
      select: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
