import {
  Box,
  Button,
  IconButton,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import { Bell, X, Eye } from "lucide-react";
import PropTypes from "prop-types";
import { toast } from "sonner";

const NotificationToast = ({ toastId, notification, onView, onDismiss }) => {
  const handleView = () => {
    if (onView) onView(notification);
    toast.dismiss(toastId);
    if (onDismiss) onDismiss();
  };

  const handleDismiss = () => {
    toast.dismiss(toastId);
    if (onDismiss) onDismiss();
  };

  return (
    <Slide in direction="down">
      <Box sx={{ maxWidth: 380, mx: "auto", mt: 2 }}>
        <Paper
          elevation={4}
          sx={{
            p: 2,
            borderLeft: "5px solid #1976d2",
            backgroundColor: "background.paper",
            position: "relative",
          }}
        >
          {/* Dismiss Button */}
          <IconButton
            onClick={handleDismiss}
            size="small"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <X size={16} />
          </IconButton>

          {/* Header */}
          <Box display="flex" alignItems="center" gap={3} mb={2}>
            <Bell size={26} style={{ color: "#1976d2" }} />
            <Typography variant="h5" fontWeight={700}>
              {notification?.title}
            </Typography>
          </Box>

          {/* Message */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {notification?.message || "A new blog was published!"}
          </Typography>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button size="small" variant="text" onClick={handleDismiss}>
              Dismiss
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Eye size={16} />}
              onClick={handleView}
              sx={{ textTransform: "none" }}
            >
              View
            </Button>
          </Box>
        </Paper>
      </Box>
    </Slide>
  );
};

export { NotificationToast };

NotificationToast.propTypes = {
  toastId: PropTypes.string.isRequired,
  notification: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onDismiss: PropTypes.func,
};
