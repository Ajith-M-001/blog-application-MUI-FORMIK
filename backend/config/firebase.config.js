import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }
    return admin;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
};

// Get Firebase Admin instance
const getFirebaseAdmin = () => {
  return admin;
};

// Send push notification to a single device
const sendPushNotification = async (token, notification, data = {}) => {
  try {
    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: {
        ...data,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        notification: {
          sound: "default",
          priority: "high",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

// Send push notification to multiple devices
const sendPushNotificationToMultiple = async (
  tokens,
  notification,
  data = {}
) => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: {
        ...data,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        notification: {
          sound: "default",
          priority: "high",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendMulticast({
      tokens,
      ...message,
    });

    console.log("Successfully sent messages:", response);
    return response;
  } catch (error) {
    console.error("Error sending push notifications:", error);
    throw error;
  }
};

// Send push notification to a topic
const sendPushNotificationToTopic = async (topic, notification, data = {}) => {
  try {
    const message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: {
        ...data,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        notification: {
          sound: "default",
          priority: "high",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("Successfully sent message to topic:", response);
    return response;
  } catch (error) {
    console.error("Error sending push notification to topic:", error);
    throw error;
  }
};

export {
  initializeFirebase,
  getFirebaseAdmin,
  sendPushNotification,
  sendPushNotificationToMultiple,
  sendPushNotificationToTopic,
};
