import Notification from "../model/notificationSchema.js";
import socketService from "../services/socket/socketService.js";

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
