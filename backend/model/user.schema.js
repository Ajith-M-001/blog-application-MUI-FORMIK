import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {
  SESSION_PREFERENCE,
  USER_ROLES,
} from "../../common/constants/constants.js";

// Auth Provider Schema
const authProviderSchema = new mongoose.Schema(
  {
    providerId: String,
    providerType: {
      type: String,
      enum: ["google", "facebook", "apple"],
    },
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
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
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
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
    maxSession: { type: Number, default: 5, min: 1, max: 5 },
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
    refreshTokens: [
      {
        token: String,
        issueAt: Date,
        expiresAt: Date,
      },
    ],
    lastLogin: {
      type: Date,
      select: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
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
