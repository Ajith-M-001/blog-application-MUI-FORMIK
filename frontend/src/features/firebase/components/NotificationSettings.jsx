import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Notifications, NotificationsOff, Topic } from "@mui/icons-material";
import { useFirebase } from "../hooks/use-firebase.js";

const NotificationSettings = () => {
  const {
    fcmToken,
    isPermissionGranted,
    isServiceWorkerRegistered,
    initializeNotifications,
    removeFCMToken,
    subscribeToTopic,
    unsubscribeFromTopic,
    isLoading,
    isSubscribing,
    isUnsubscribing,
  } = useFirebase();

  const [subscribedTopics, setSubscribedTopics] = React.useState([
    "general",
    "blog-updates",
    "new-posts",
  ]);

  const handleToggleNotifications = async () => {
    if (isPermissionGranted) {
      await removeFCMToken();
    } else {
      await initializeNotifications();
    }
  };

  const handleTopicToggle = (topic) => {
    if (subscribedTopics.includes(topic)) {
      unsubscribeFromTopic(topic);
      setSubscribedTopics((prev) => prev.filter((t) => t !== topic));
    } else {
      subscribeToTopic(topic);
      setSubscribedTopics((prev) => [...prev, topic]);
    }
  };

  const getNotificationStatus = () => {
    if (!isServiceWorkerRegistered) {
      return {
        status: "error",
        message: "Service Worker not supported or failed to register",
      };
    }

    if (!isPermissionGranted) {
      return {
        status: "warning",
        message: "Notification permission not granted",
      };
    }

    return {
      status: "success",
      message: "Push notifications are enabled",
    };
  };

  const status = getNotificationStatus();

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Notification Settings
        </Typography>

        {/* Status Alert */}
        <Alert severity={status.status} sx={{ mb: 3 }}>
          {status.message}
        </Alert>

        {/* Main Toggle */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isPermissionGranted}
                onChange={handleToggleNotifications}
                disabled={isLoading}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isPermissionGranted ? (
                  <Notifications color="primary" />
                ) : (
                  <NotificationsOff />
                )}
                <Typography variant="body1">
                  Enable Push Notifications
                </Typography>
                {isLoading && <CircularProgress size={16} />}
              </Box>
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* FCM Token Display */}
        {fcmToken && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              FCM Token:
            </Typography>
            <Chip
              label={fcmToken.substring(0, 20) + "..."}
              variant="outlined"
              size="small"
              sx={{ fontFamily: "monospace" }}
            />
          </Box>
        )}

        {/* Topic Subscriptions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Topic sx={{ mr: 1, verticalAlign: "middle" }} />
            Topic Subscriptions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose which types of notifications you want to receive
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                id: "general",
                label: "General Updates",
                description: "Important announcements and updates",
              },
              {
                id: "blog-updates",
                label: "Blog Updates",
                description: "When blogs you follow are updated",
              },
              {
                id: "new-posts",
                label: "New Posts",
                description: "When new posts are published",
              },
              {
                id: "comments",
                label: "Comments",
                description: "When someone comments on your posts",
              },
              {
                id: "followers",
                label: "Followers",
                description: "When someone follows you",
              },
            ].map((topic) => (
              <FormControlLabel
                key={topic.id}
                control={
                  <Switch
                    checked={subscribedTopics.includes(topic.id)}
                    onChange={() => handleTopicToggle(topic.id)}
                    disabled={
                      !isPermissionGranted || isSubscribing || isUnsubscribing
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">{topic.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {topic.description}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        </Box>

        {/* Manual Refresh Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={initializeNotifications}
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={16} /> : <Notifications />
            }
          >
            Refresh Notification Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
