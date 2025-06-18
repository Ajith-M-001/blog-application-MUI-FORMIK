import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { showToast } from "../../shared/utils/toast";
import { useIsAuthenticated } from "../../shared/store/userStore";
import { useNotificationActions } from "../../shared/store/notificationStore";
import { toastService } from "../../shared/services/toastService";
import { useNavigate } from "react-router";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const isAuthenticated = useIsAuthenticated();
  const { addNotification } = useNotificationActions();
  console.log("isAuthenticated", isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL_DEV, {
        withCredentials: true,
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      const socket = socketRef.current;

      socket.on("connect", () => console.log("Socket connected"));

      socket.on("newNotification", (notification) => {
        addNotification(notification);
        toastService.notification(notification, {
          onView: () => {
            navigate(`/blogs/${notification.slug}`);
          },
          onDismiss: () => {
            // Optional: Add logic if needed for dismiss
          },
        });
      });
      socket.on("disconnect", () =>
        showToast("Disconnected. Attempting to reconnect...", {
          type: "warning",
        })
      );
      socket.on("reconnect", () =>
        showToast("Reconnected to server", { type: "success" })
      );
      socket.on("connect_error", (err) =>
        showToast(`Connection error: ${err.message}`, { type: "error" })
      );
    }

    const socket = socketRef.current;

    if (isAuthenticated) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
