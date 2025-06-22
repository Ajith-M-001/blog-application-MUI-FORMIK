import { admin } from "../firebaseAdmin.js";
import Notification from "../model/notificationSchema.js";
import userModel from "../model/user.schema.js";
import socketService from "../services/socket/socketService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  blogId,
  slug,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      blogId,
      slug,
    });

    const populatedNotification = await Notification.findById(
      notification._id
    ).populate("sender", "firstName lastName username avatar");

    console.log("populatedNotification", populatedNotification);

    // Emit notification if recipient is connected
    const io = socketService.getIO();
    const recipientSocketId = socketService.userSockets.get(
      recipient.toString()
    );

    console.log("check2456", recipientSocketId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newNotification", populatedNotification);
      console.log("Notification emitted to:", {
        recipient: recipient.toString(),
        socketId: recipientSocketId,
        notificationId: notification._id,
      });
    }

    return populatedNotification;
  } catch (error) {
    throw error;
  }
};

export const sendPushNotification = async (tokens, payload) => {
  if (!tokens || tokens.length === 0) return;
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {}, // optional custom data
    });

    console.log("Push Notification Result:", response);
    return response;
  } catch (error) {
    console.error("Error sending push notifications:", error);
    throw error;
  }
};
export const registerToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const userId = req.user?._id;

  if (!token || !userId) {
    return res
      .status(400)
      .json(ApiResponse.error("Token and user ID are required", 400));
  }

  const user = await userModel.findById(userId).select("fcmToken");

  if (!user) {
    return res.status(404).json(ApiResponse.error("User not found", 404));
  }

  const existingToken = user.fcmToken.find((t) => t.token === token);

  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || req.connection.remoteAddress || "";

  if (existingToken) {
    existingToken.lastUsedAt = new Date();
    console.log("updated successfully");
  } else {
    user.fcmToken.push({
      token,
      deviceInfo: {
        os: getUserOS(userAgent),
        browser: getBrowser(userAgent),
        ip: ip,
        userAgent: userAgent,
        lastLocation: "",
      },
      createdAt: new Date(),
      lastUsedAt: new Date(),
    });
  }

  await user.save();

  return res
    .status(200)
    .json(ApiResponse.success("FCM token registered successfully", null, 200));
});

function getUserOS(userAgent) {
  if (!userAgent) return "Unknown";
  if (userAgent.includes("Windows NT")) return "Windows";
  if (userAgent.includes("Mac")) return "MacOS";
  if (userAgent.includes("Android")) return "Android";
  if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  )
    return "iOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "Unknown";
}

// Helper function to extract browser from user agent
function getBrowser(userAgent) {
  if (!userAgent) return "Unknown";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/"))
    return "Internet Explorer";
  return "Unknown";
}
