import {
  sendPushNotification,
  sendPushNotificationToMultiple,
  sendPushNotificationToTopic,
} from "../../config/firebase.config.js";
import User from "../../model/user.schema.js";

class FirebaseNotificationService {
  // Add FCM token to user
  async addFCMToken(userId, token, deviceType = "web") {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if token already exists
      const existingToken = user.fcmTokens.find((t) => t.token === token);
      if (!existingToken) {
        user.fcmTokens.push({ token, deviceType });
        await user.save();
      }

      return { success: true, message: "FCM token added successfully" };
    } catch (error) {
      console.error("Error adding FCM token:", error);
      throw error;
    }
  }

  // Remove FCM token from user
  async removeFCMToken(userId, token) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.fcmTokens = user.fcmTokens.filter((t) => t.token !== token);
      await user.save();

      return { success: true, message: "FCM token removed successfully" };
    } catch (error) {
      console.error("Error removing FCM token:", error);
      throw error;
    }
  }

  // Send notification to a specific user
  async sendNotificationToUser(userId, notification, data = {}) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.fcmTokens.length) {
        throw new Error("User not found or no FCM tokens available");
      }

      const tokens = user.fcmTokens.map((t) => t.token);
      const response = await sendPushNotificationToMultiple(
        tokens,
        notification,
        data
      );

      return {
        success: true,
        message: "Notification sent successfully",
        response,
      };
    } catch (error) {
      console.error("Error sending notification to user:", error);
      throw error;
    }
  }

  // Send notification to multiple users
  async sendNotificationToUsers(userIds, notification, data = {}) {
    try {
      const users = await User.find({ _id: { $in: userIds } });
      const allTokens = users.flatMap((user) =>
        user.fcmTokens.map((t) => t.token)
      );

      if (allTokens.length === 0) {
        throw new Error("No FCM tokens available");
      }

      const response = await sendPushNotificationToMultiple(
        allTokens,
        notification,
        data
      );

      return {
        success: true,
        message: "Notifications sent successfully",
        response,
      };
    } catch (error) {
      console.error("Error sending notifications to users:", error);
      throw error;
    }
  }

  // Send notification to all users
  async sendNotificationToAllUsers(notification, data = {}) {
    try {
      const users = await User.find({ "fcmTokens.0": { $exists: true } });
      const allTokens = users.flatMap((user) =>
        user.fcmTokens.map((t) => t.token)
      );

      if (allTokens.length === 0) {
        throw new Error("No FCM tokens available");
      }

      const response = await sendPushNotificationToMultiple(
        allTokens,
        notification,
        data
      );

      return {
        success: true,
        message: "Notifications sent to all users successfully",
        response,
      };
    } catch (error) {
      console.error("Error sending notifications to all users:", error);
      throw error;
    }
  }

  // Send notification to topic
  async sendNotificationToTopic(topic, notification, data = {}) {
    try {
      const response = await sendPushNotificationToTopic(
        topic,
        notification,
        data
      );

      return {
        success: true,
        message: "Notification sent to topic successfully",
        response,
      };
    } catch (error) {
      console.error("Error sending notification to topic:", error);
      throw error;
    }
  }

  // Subscribe user to topic
  async subscribeUserToTopic(userId, topic) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.fcmTokens.length) {
        throw new Error("User not found or no FCM tokens available");
      }

      const tokens = user.fcmTokens.map((t) => t.token);
      const { getFirebaseAdmin } = await import(
        "../../config/firebase.config.js"
      );
      const admin = getFirebaseAdmin();

      const response = await admin.messaging().subscribeToTopic(tokens, topic);

      return {
        success: true,
        message: "User subscribed to topic successfully",
        response,
      };
    } catch (error) {
      console.error("Error subscribing user to topic:", error);
      throw error;
    }
  }

  // Unsubscribe user from topic
  async unsubscribeUserFromTopic(userId, topic) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.fcmTokens.length) {
        throw new Error("User not found or no FCM tokens available");
      }

      const tokens = user.fcmTokens.map((t) => t.token);
      const { getFirebaseAdmin } = await import(
        "../../config/firebase.config.js"
      );
      const admin = getFirebaseAdmin();

      const response = await admin
        .messaging()
        .unsubscribeFromTopic(tokens, topic);

      return {
        success: true,
        message: "User unsubscribed from topic successfully",
        response,
      };
    } catch (error) {
      console.error("Error unsubscribing user from topic:", error);
      throw error;
    }
  }
}

export default new FirebaseNotificationService();
