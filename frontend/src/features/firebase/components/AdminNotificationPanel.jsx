import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import { Send, Notifications } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { firebaseAPI } from "../api/firebase.api.js";
import { toast } from "sonner";

const AdminNotificationPanel = () => {
  const [notificationType, setNotificationType] = useState("all");
  const [notification, setNotification] = useState({
    title: "",
    body: "",
    imageUrl: "",
  });
  const [data, setData] = useState({
    url: "",
    type: "",
  });
  const [userIds, setUserIds] = useState("");
  const [topic, setTopic] = useState("");

  // Mutations
  const sendToUserMutation = useMutation({
    mutationFn: ({ userId, notification, data }) =>
      firebaseAPI.sendNotificationToUser(userId, notification, data),
    onSuccess: () => {
      toast.success("Notification sent successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to send notification");
      console.error("Error sending notification:", error);
    },
  });

  const sendToUsersMutation = useMutation({
    mutationFn: ({ userIds, notification, data }) =>
      firebaseAPI.sendNotificationToUsers(userIds, notification, data),
    onSuccess: () => {
      toast.success("Notifications sent successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to send notifications");
      console.error("Error sending notifications:", error);
    },
  });

  const sendToAllMutation = useMutation({
    mutationFn: ({ notification, data }) =>
      firebaseAPI.sendNotificationToAllUsers(notification, data),
    onSuccess: () => {
      toast.success("Notifications sent to all users");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to send notifications to all users");
      console.error("Error sending notifications to all users:", error);
    },
  });

  const sendToTopicMutation = useMutation({
    mutationFn: ({ topic, notification, data }) =>
      firebaseAPI.sendNotificationToTopic(topic, notification, data),
    onSuccess: () => {
      toast.success("Notification sent to topic");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to send notification to topic");
      console.error("Error sending notification to topic:", error);
    },
  });

  const resetForm = () => {
    setNotification({ title: "", body: "", imageUrl: "" });
    setData({ url: "", type: "" });
    setUserIds("");
    setTopic("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!notification.title || !notification.body) {
      toast.error("Title and body are required");
      return;
    }

    const notificationData = {
      notification,
      data: { ...data, timestamp: new Date().toISOString() },
    };

    switch (notificationType) {
      case "user":
        if (!userIds) {
          toast.error("User ID is required");
          return;
        }
        sendToUserMutation.mutate({
          userId: userIds,
          ...notificationData,
        });
        break;

      case "users":
        if (!userIds) {
          toast.error("User IDs are required");
          return;
        }
        const userIdArray = userIds.split(",").map((id) => id.trim());
        sendToUsersMutation.mutate({
          userIds: userIdArray,
          ...notificationData,
        });
        break;

      case "all":
        sendToAllMutation.mutate(notificationData);
        break;

      case "topic":
        if (!topic) {
          toast.error("Topic is required");
          return;
        }
        sendToTopicMutation.mutate({
          topic,
          ...notificationData,
        });
        break;

      default:
        toast.error("Please select a notification type");
    }
  };

  const isLoading =
    sendToUserMutation.isPending ||
    sendToUsersMutation.isPending ||
    sendToAllMutation.isPending ||
    sendToTopicMutation.isPending;

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          <Notifications sx={{ mr: 1, verticalAlign: "middle" }} />
          Send Push Notifications
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Send push notifications to users. Make sure to test with a small group
          first.
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Notification Type */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Notification Type</InputLabel>
                <Select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  label="Notification Type"
                >
                  <MenuItem value="user">Single User</MenuItem>
                  <MenuItem value="users">Multiple Users</MenuItem>
                  <MenuItem value="all">All Users</MenuItem>
                  <MenuItem value="topic">Topic</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* User IDs or Topic */}
            {notificationType === "user" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="User ID"
                  value={userIds}
                  onChange={(e) => setUserIds(e.target.value)}
                  placeholder="Enter user ID"
                  helperText="Enter the user ID to send notification to"
                />
              </Grid>
            )}

            {notificationType === "users" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="User IDs"
                  value={userIds}
                  onChange={(e) => setUserIds(e.target.value)}
                  placeholder="user1, user2, user3"
                  helperText="Enter comma-separated user IDs"
                />
              </Grid>
            )}

            {notificationType === "topic" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="general, blog-updates, new-posts"
                  helperText="Enter the topic name"
                />
              </Grid>
            )}

            <Divider sx={{ width: "100%", my: 2 }} />

            {/* Notification Content */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Notification Content
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={notification.title}
                onChange={(e) =>
                  setNotification({ ...notification, title: e.target.value })
                }
                placeholder="Enter notification title"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Body"
                value={notification.body}
                onChange={(e) =>
                  setNotification({ ...notification, body: e.target.value })
                }
                placeholder="Enter notification body"
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL (Optional)"
                value={notification.imageUrl}
                onChange={(e) =>
                  setNotification({ ...notification, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                helperText="URL of the image to display in the notification"
              />
            </Grid>

            <Divider sx={{ width: "100%", my: 2 }} />

            {/* Additional Data */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Data
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL (Optional)"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
                placeholder="https://example.com"
                helperText="URL to open when notification is clicked"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Type (Optional)"
                value={data.type}
                onChange={(e) => setData({ ...data, type: e.target.value })}
                placeholder="blog, comment, follow"
                helperText="Type of notification for handling"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? <CircularProgress size={20} /> : <Send />
                  }
                >
                  {isLoading ? "Sending..." : "Send Notification"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminNotificationPanel;
