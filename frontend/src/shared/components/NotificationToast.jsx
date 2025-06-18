// const NotificationToast = ({ toastId, notification, onView, onDismiss }) => {
//   console.log("notificationad", notification, toastId, onView, onDismiss);
//   return <div>NotificationToast</div>;
// };

// export default NotificationToast;

// NotificationToast.jsx
import { useNavigate } from "react-router";
import { useNotificationActions } from "../../shared/store/notificationStore";
import { toastService } from "../services/toastService";
import { NOTIFICATION_TYPES } from "../constants/constants";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import {
  Close as CloseIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
const getColor = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.NEW_BLOG_POST:
      return "primary.main";
    case NOTIFICATION_TYPES.NEW_COMMENT:
      return "info.main";
    case NOTIFICATION_TYPES.NEW_LIKE:
      return "error.main";
    case NOTIFICATION_TYPES.NEW_FOLLOW:
      return "success.main";
    default:
      return "grey.600";
  }
};
const NotificationToast = ({ toastId, notification, onView, onDismiss }) => {
  const handleView = () => {
    if (onView) onView(notification);
    onDismiss?.();
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    onDismiss?.();
  };

  console.log("notificationsa", notification);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderLeft: `4px solid`,
        borderLeftColor: getColor(notification.type),
        p: 2,
        borderRadius: 2,
        minWidth: 350,
        maxWidth: 400,
        boxShadow: 3,
        position: "relative",
      }}
    >
      <IconButton
        size="small"
        onClick={handleDismiss}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {notification.title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
        <Avatar
          src={notification.sender?.avatar?.url}
          alt={notification.sender?.firstName}
          sx={{ mr: 2 }}
        >
          {notification.sender?.firstName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="body2">{notification.message}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={handleDismiss}>
          Dismiss
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleView}
          startIcon={<ViewIcon />}
          sx={{ bgcolor: getColor(notification.type) }}
        >
          View
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationToast;
