import FirebaseNotificationService from "../services/firebase/notificationService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

// Add FCM token to user
const addFCMToken = AsyncHandler(async (req, res) => {
  const { token, deviceType = "web" } = req.body;
  const userId = req.user._id;

  if (!token) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "FCM token is required"));
  }

  const result = await FirebaseNotificationService.addFCMToken(
    userId,
    token,
    deviceType
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "FCM token added successfully"));
});

// Remove FCM token from user
const removeFCMToken = AsyncHandler(async (req, res) => {
  const { token } = req.body;
  const userId = req.user._id;

  if (!token) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "FCM token is required"));
  }

  const result = await FirebaseNotificationService.removeFCMToken(
    userId,
    token
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "FCM token removed successfully"));
});

// Send notification to a specific user (admin only)
const sendNotificationToUser = AsyncHandler(async (req, res) => {
  const { userId, notification, data } = req.body;

  if (!userId || !notification || !notification.title || !notification.body) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "User ID, notification title and body are required"
        )
      );
  }

  const result = await FirebaseNotificationService.sendNotificationToUser(
    userId,
    notification,
    data
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Notification sent successfully"));
});

// Send notification to multiple users (admin only)
const sendNotificationToUsers = AsyncHandler(async (req, res) => {
  const { userIds, notification, data } = req.body;

  if (
    !userIds ||
    !Array.isArray(userIds) ||
    !notification ||
    !notification.title ||
    !notification.body
  ) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "User IDs array, notification title and body are required"
        )
      );
  }

  const result = await FirebaseNotificationService.sendNotificationToUsers(
    userIds,
    notification,
    data
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Notifications sent successfully"));
});

// Send notification to all users (admin only)
const sendNotificationToAllUsers = AsyncHandler(async (req, res) => {
  const { notification, data } = req.body;

  if (!notification || !notification.title || !notification.body) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Notification title and body are required")
      );
  }

  const result = await FirebaseNotificationService.sendNotificationToAllUsers(
    notification,
    data
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Notifications sent to all users successfully"
      )
    );
});

// Send notification to topic (admin only)
const sendNotificationToTopic = AsyncHandler(async (req, res) => {
  const { topic, notification, data } = req.body;

  if (!topic || !notification || !notification.title || !notification.body) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Topic, notification title and body are required"
        )
      );
  }

  const result = await FirebaseNotificationService.sendNotificationToTopic(
    topic,
    notification,
    data
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Notification sent to topic successfully")
    );
});

// Subscribe user to topic
const subscribeToTopic = AsyncHandler(async (req, res) => {
  const { topic } = req.body;
  const userId = req.user._id;

  if (!topic) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Topic is required"));
  }

  const result = await FirebaseNotificationService.subscribeUserToTopic(
    userId,
    topic
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Subscribed to topic successfully"));
});

// Unsubscribe user from topic
const unsubscribeFromTopic = AsyncHandler(async (req, res) => {
  const { topic } = req.body;
  const userId = req.user._id;

  if (!topic) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Topic is required"));
  }

  const result = await FirebaseNotificationService.unsubscribeUserFromTopic(
    userId,
    topic
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Unsubscribed from topic successfully"));
});

export {
  addFCMToken,
  removeFCMToken,
  sendNotificationToUser,
  sendNotificationToUsers,
  sendNotificationToAllUsers,
  sendNotificationToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
};
