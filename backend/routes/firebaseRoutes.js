import express from "express";
import {
  addFCMToken,
  removeFCMToken,
  sendNotificationToUser,
  sendNotificationToUsers,
  sendNotificationToAllUsers,
  sendNotificationToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../controllers/firebaseController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(verifyJWT);

// User routes
router.post("/add-token", addFCMToken);
router.post("/remove-token", removeFCMToken);
router.post("/subscribe-topic", subscribeToTopic);
router.post("/unsubscribe-topic", unsubscribeFromTopic);

// Admin routes (you may want to add admin middleware here)
router.post("/send-to-user", sendNotificationToUser);
router.post("/send-to-users", sendNotificationToUsers);
router.post("/send-to-all", sendNotificationToAllUsers);
router.post("/send-to-topic", sendNotificationToTopic);

export default router;
