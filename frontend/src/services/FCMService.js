import { getToken } from "firebase/messaging";
import { messaging } from "../config/firebase";

class FCMService {
  constructor({ vapidKey }) {
    if (!vapidKey) {
      console.log("VAPID Key is required for Firebase Messaging");
      throw new Error("VAPID Key is required for Firebase Messaging");
    }
    this.vapidKey = vapidKey;
    this.token = null;
    this.userId = null;
  }

  async initialize(userId) {
    this.userId = userId;

    try {
      const permissionGranted = await this.requestPermission();
      console.log("Permission Granted:", permissionGranted);
      if (!permissionGranted) {
        console.warn("User denied notification permission.");
        return null;
      }

      this.token = await this.generateToken();

      await this.registerTokenToServer(this.token, this.userId);
    } catch (error) {
      console.error("[FCM] Initialization failed:", error);
      return null;
    }
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("[FCM] Permission request error:", error);
      return false;
    }
  }

  async generateToken() {
    try {
      const token = await getToken(messaging, {
        vapidKey: this.vapidKey,
      });

      if (token) {
        console.info("FCM Token generated:", token);
        return token;
      } else {
        console.warn("No FCM token available.");
        return null;
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      //   throw error;
    }
  }

  async registerTokenToServer(token, userId) {
    console.log("register to server", token, userId);
  }
}

export default FCMService;
