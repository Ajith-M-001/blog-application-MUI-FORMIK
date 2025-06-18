// const NotificationToast = ({ toastId, notification, onView, onDismiss }) => {
//   console.log("notificationad", notification, toastId, onView, onDismiss);
//   return <div>NotificationToast</div>;
// };

// export default NotificationToast;

// NotificationToast.jsx
import { Button, Box } from "@mui/material"; // Assuming Material UI is used
import { useNavigate } from "react-router";
import { useNotificationActions } from "../../shared/store/notificationStore";
import { toastService } from "../services/toastService";

const NotificationToast = ({ toastId, notification, onView, onDismiss }) => {
//   const navigate = useNavigate();
  const { markAsRead } = useNotificationActions(); // Assuming markAsRead is added to notificationActions

  const handleView = () => {
    if (onView) onView(notification); // Optional callback from ToastService
    // navigate(`/blogs/${notification.slug}`);
    markAsRead(notification._id); // Mark as read in Zustand store
    toastService.dismiss(toastId); // Dismiss the toast
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss(notification); // Optional callback from ToastService
    toastService.dismiss(toastId); // Dismiss the toast without marking as read
  };

  return (
    <Box
      sx={{
        padding: "16px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Box sx={{ marginBottom: "8px" }}>
        <strong>{notification.title}</strong>
        <p>{notification.message}</p>
      </Box>
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleView}
        >
          View
        </Button>
        <Button variant="outlined" size="small" onClick={handleDismiss}>
          Dismiss
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationToast;
