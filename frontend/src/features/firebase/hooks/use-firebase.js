import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { firebaseAPI } from "../api/firebase.api.js";
import {
  requestNotificationPermission,
  onMessageListener,
  registerServiceWorker,
  isServiceWorkerSupported,
} from "../../../lib/firebase.js";
import { toast } from "sonner";

export const useFirebase = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);
  const queryClient = useQueryClient();

  // Mutations
  const addTokenMutation = useMutation({
    mutationFn: ({ token, deviceType }) =>
      firebaseAPI.addFCMToken(token, deviceType),
    onSuccess: (data) => {
      console.log("FCM token added successfully:", data);
      toast.success("Push notifications enabled");
    },
    onError: (error) => {
      console.error("Error adding FCM token:", error);
      toast.error("Failed to enable push notifications");
    },
  });

  const removeTokenMutation = useMutation({
    mutationFn: ({ token }) => firebaseAPI.removeFCMToken(token),
    onSuccess: (data) => {
      console.log("FCM token removed successfully:", data);
      toast.success("Push notifications disabled");
    },
    onError: (error) => {
      console.error("Error removing FCM token:", error);
      toast.error("Failed to disable push notifications");
    },
  });

  const subscribeTopicMutation = useMutation({
    mutationFn: ({ topic }) => firebaseAPI.subscribeToTopic(topic),
    onSuccess: (data) => {
      console.log("Subscribed to topic successfully:", data);
      toast.success(`Subscribed to ${topic}`);
    },
    onError: (error) => {
      console.error("Error subscribing to topic:", error);
      toast.error("Failed to subscribe to topic");
    },
  });

  const unsubscribeTopicMutation = useMutation({
    mutationFn: ({ topic }) => firebaseAPI.unsubscribeFromTopic(topic),
    onSuccess: (data) => {
      console.log("Unsubscribed from topic successfully:", data);
      toast.success(`Unsubscribed from ${topic}`);
    },
    onError: (error) => {
      console.error("Error unsubscribing from topic:", error);
      toast.error("Failed to unsubscribe from topic");
    },
  });

  // Initialize Firebase notifications
  const initializeNotifications = useCallback(async () => {
    try {
      // Check if service worker is supported
      if (!isServiceWorkerSupported()) {
        console.log("Service Worker not supported");
        return;
      }

      // Register service worker
      const swRegistered = await registerServiceWorker();
      setIsServiceWorkerRegistered(swRegistered);

      if (!swRegistered) {
        console.log("Failed to register service worker");
        return;
      }

      // Request notification permission
      const token = await requestNotificationPermission();

      if (token) {
        setFcmToken(token);
        setIsPermissionGranted(true);

        // Add token to backend
        addTokenMutation.mutate({ token, deviceType: "web" });
      } else {
        setIsPermissionGranted(false);
      }
    } catch (error) {
      console.error("Error initializing notifications:", error);
    }
  }, [addTokenMutation]);

  // Remove FCM token
  const removeFCMToken = useCallback(async () => {
    if (fcmToken) {
      removeTokenMutation.mutate({ token: fcmToken });
      setFcmToken(null);
      setIsPermissionGranted(false);
    }
  }, [fcmToken, removeTokenMutation]);

  // Subscribe to topic
  const subscribeToTopic = useCallback(
    (topic) => {
      subscribeTopicMutation.mutate({ topic });
    },
    [subscribeTopicMutation]
  );

  // Unsubscribe from topic
  const unsubscribeFromTopic = useCallback(
    (topic) => {
      unsubscribeTopicMutation.mutate({ topic });
    },
    [unsubscribeTopicMutation]
  );

  // Handle foreground messages
  useEffect(() => {
    const handleForegroundMessage = async () => {
      try {
        const payload = await onMessageListener();
        console.log("Foreground message received:", payload);

        // Show toast notification
        if (payload?.notification) {
          toast(payload.notification.title, {
            description: payload.notification.body,
            action: {
              label: "View",
              onClick: () => {
                // Handle notification click
                if (payload.data?.url) {
                  window.open(payload.data.url, "_blank");
                }
              },
            },
          });
        }
      } catch (error) {
        console.error("Error handling foreground message:", error);
      }
    };

    if (isPermissionGranted) {
      handleForegroundMessage();
    }
  }, [isPermissionGranted]);

  // Initialize notifications on mount
  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  return {
    fcmToken,
    isPermissionGranted,
    isServiceWorkerRegistered,
    initializeNotifications,
    removeFCMToken,
    subscribeToTopic,
    unsubscribeFromTopic,
    isLoading: addTokenMutation.isPending || removeTokenMutation.isPending,
    isSubscribing: subscribeTopicMutation.isPending,
    isUnsubscribing: unsubscribeTopicMutation.isPending,
  };
};
