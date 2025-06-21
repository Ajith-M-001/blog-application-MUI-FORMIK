import { axiosClient } from "../../../api/axiosClient.js";

const FIREBASE_ENDPOINTS = {
  ADD_TOKEN: "/firebase/add-token",
  REMOVE_TOKEN: "/firebase/remove-token",
  SUBSCRIBE_TOPIC: "/firebase/subscribe-topic",
  UNSUBSCRIBE_TOPIC: "/firebase/unsubscribe-topic",
  SEND_TO_USER: "/firebase/send-to-user",
  SEND_TO_USERS: "/firebase/send-to-users",
  SEND_TO_ALL: "/firebase/send-to-all",
  SEND_TO_TOPIC: "/firebase/send-to-topic",
};

export const firebaseAPI = {
  // Add FCM token to user
  addFCMToken: async (token, deviceType = "web") => {
    const response = await axiosClient.post(FIREBASE_ENDPOINTS.ADD_TOKEN, {
      token,
      deviceType,
    });
    return response.data;
  },

  // Remove FCM token from user
  removeFCMToken: async (token) => {
    const response = await axiosClient.post(FIREBASE_ENDPOINTS.REMOVE_TOKEN, {
      token,
    });
    return response.data;
  },

  // Subscribe user to topic
  subscribeToTopic: async (topic) => {
    const response = await axiosClient.post(
      FIREBASE_ENDPOINTS.SUBSCRIBE_TOPIC,
      {
        topic,
      }
    );
    return response.data;
  },

  // Unsubscribe user from topic
  unsubscribeFromTopic: async (topic) => {
    const response = await axiosClient.post(
      FIREBASE_ENDPOINTS.UNSUBSCRIBE_TOPIC,
      {
        topic,
      }
    );
    return response.data;
  },

  // Send notification to specific user (admin only)
  sendNotificationToUser: async (userId, notification, data = {}) => {
    const response = await axiosClient.post(FIREBASE_ENDPOINTS.SEND_TO_USER, {
      userId,
      notification,
      data,
    });
    return response.data;
  },

  // Send notification to multiple users (admin only)
  sendNotificationToUsers: async (userIds, notification, data = {}) => {
    const response = await axiosClient.post(FIREBASE_ENDPOINTS.SEND_TO_USERS, {
      userIds,
      notification,
      data,
    });
    return response.data;
  },

  // Send notification to all users (admin only)
  sendNotificationToAllUsers: async (notification, data = {}) => {
    const response = await axiosClient.post(FIREBASE_ENDPOINTS.SEND_TO_ALL, {
      notification,
      data,
    });
    return response.data;
  },

  // Send notification to topic (admin only)
  sendNotificationToTopic: async (topic, notification, data = {}) => {
    const response = await axiosClient.post(FIREBASE_ENDPOINTS.SEND_TO_TOPIC, {
      topic,
      notification,
      data,
    });
    return response.data;
  },
};
