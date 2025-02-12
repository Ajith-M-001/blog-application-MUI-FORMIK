import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Session Schema
const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    maxSession: { type: Number, default: 5 },
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
    isValid: {
      type: Boolean,
      default: true,
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
      sparse: false,
      trim: true,
      lowercase: true,
    },
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    roles: {
      type: [String],
      enum: ["Super Admin", "Admin", "Author", "Reader", "Subscriber"],
      default: ["Reader"],
    },
    sessionPreference: {
      type: String,
      enum: ["single", "multiple"],
      default: "multiple",
    },
    isActive: {
      type: Boolean,
      default: false,
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
    sessions: { type: [sessionSchema], select: false },
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

// Ensure either email or phoneNumber is provided
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phoneNumber) {
    next(new Error("Either email or phone number is required"));
  }
  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
