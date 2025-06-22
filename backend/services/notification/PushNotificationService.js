import { messaging } from "../../firebaseAdmin.js";
import userModel from "../../model/user.schema.js";

class PushNotificationService {
  async sendPushNotification(userId, notificationData) {
    try {
      const user = await userModel.findById(userId).select("fcmToken");
      if (!user || user.fcmToken.length === 0) return;
      const messages = user.fcmToken.map((tokenObj) => ({
        token: tokenObj.token,
        notification: {
          title: notificationData.title,
          body: notificationData.message,
        },
        data: {
          blogId: notificationData.blogId?.toString() || "",
          slug: notificationData.slug || "",
        },
      }));

      console.log("dasdfasdfsda", messages);
      const responses = await Promise.all(
        messages.map((msg) => messaging.send(msg))
      );

      return responses;
    } catch (error) {
      throw error;
    }
  }

  async sendMultiplePushNotifications(userIds, notificationData) {
    try {
      const users = await userModel
        .find({ _id: { $in: userIds } })
        .select("fcmToken");

      console.log("dfsdafsdafasd", users);
    } catch (error) {
      console.log("errors", errors);
    }
  }
}

const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
