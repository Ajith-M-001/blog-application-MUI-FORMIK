// user.store.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";

const INITIAL_NOTIFICATION_STATE = Object.freeze({
  notifications: [],
  unreadCount: 0,
  activeNotification: null, // for UI (e.g. snackbar)
});

const useNotificationStore = create(
  subscribeWithSelector(
    devtools(
      persist(
        immer((set) => ({
          notification: { ...INITIAL_NOTIFICATION_STATE },
          notificationActions: {
            addNotification: (notification) =>
              set(
                (state) => {
                  const exists = state.notification.notifications.some(
                    (n) => n._id === notification._id
                  );
                  if (!exists) {
                    state.notification.notifications.unshift(notification);
                    state.notification.unreadCount += 1;
                    state.notification.activeNotification = notification;
                  }
                },
                false,
                "notification/addNotification"
              ),
          },
        })),
        {
          name: "notification-store",
          version: 1,
          partialize: (state) => ({
            notification: {
              ...state.notification,
              activeNotification: null, // avoid persisting UI-only state
            },
          }),
        }
      ),
      { name: "NotificationStore" }
    )
  )
);

// Selectors
export const useNotificationActions = () =>
  useNotificationStore((state) => state.notificationActions);
