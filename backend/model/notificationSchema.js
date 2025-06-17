import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "../constants/constants.js";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
      index: true, // Optional but helpful for filtering by type
    },
    title: {
      type: String,
      required: true,
      maxlength: 100, // Fixed: should be lowercase "maxlength"
    },
    message: {
      type: String,
      required: true,
      maxlength: 200, // Fixed: should be lowercase "maxlength"
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog", // This ref is important for populate
    },
    slug:{type:String},
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 }); // Recent notifications for user
notificationSchema.index({ recipient: 1, isRead: 1 }); // Unread/read filtering
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
); // TTL: 30 days
notificationSchema.index({ recipient: 1, type: 1 }); // Filter by type per user

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
