import React from "react";
import { toast } from "sonner";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import { Close, Visibility, Article } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";

const CustomNotificationToast = ({ notification, t }) => {
  const theme = useTheme();
  const { sender, title, message, type, createdAt, slug } = notification;

  const getTypeColor = (notificationType) => {
    switch (notificationType) {
      case "NEW_BLOG_POST":
        return theme.palette.primary.main;
      case "COMMENT":
        return theme.palette.success.main;
      case "LIKE":
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getTypeIcon = (notificationType) => {
    switch (notificationType) {
      case "NEW_BLOG_POST":
        return <Article sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        gap: 2,
        p: 2.5,
        minWidth: 380,
        maxWidth: 420,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        backdropFilter: "blur(8px)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.16)}`,
        },
      }}
    >
      {/* Close button */}
      <IconButton
        size="small"
        onClick={() => toast.dismiss(t)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
          },
        }}
      >
        <Close sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Avatar with indicator */}
      <Box sx={{ position: "relative", flexShrink: 0, mt: 2 }}>
        <Avatar
          src={sender?.avatar?.url || "/placeholder.svg"}
          alt={`${sender?.firstName.toUpperCase()} ${sender?.lastName.toUpperCase()}`}
          sx={{
            width: 44,
            height: 44,
            border: `2px solid ${alpha(getTypeColor(type), 0.2)}`,
            boxShadow: `0 0 0 1px ${alpha(getTypeColor(type), 0.1)}`,
          }}
        />
        {/* <Box
          sx={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: getTypeColor(type),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${theme.palette.background.paper}`,
            color: "white",
          }}
        >
          {getTypeIcon(type)}
        </Box> */}
      </Box>

      {/* Notification content */}
      <Box sx={{ flex: 1, minWidth: 0, mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Typography variant="subtitle2" fontWeight={600} fontSize="0.875rem">
            {sender?.firstName} {sender?.lastName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize="0.75rem"
          >
            @{sender?.username}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize="0.75rem"
          >
            {formatTimeAgo(createdAt)}
          </Typography>
        </Stack>

        <Typography variant="body2" fontWeight={500} mb={0.5} lineHeight={1.4}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={1.5}
          lineHeight={1.4}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {message}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Visibility sx={{ fontSize: 16 }} />}
            onClick={() => {
              toast.dismiss(t);
            }}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.75rem",
              px: 2,
              py: 0.5,
              borderRadius: 1.5,
              backgroundColor: getTypeColor(type),
              "&:hover": {
                backgroundColor: alpha(getTypeColor(type), 0.8),
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px ${alpha(getTypeColor(type), 0.3)}`,
              },
            }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => toast.dismiss(t)}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.75rem",
              px: 2,
              py: 0.5,
              borderRadius: 1.5,
              borderColor: alpha(theme.palette.text.secondary, 0.3),
              color: theme.palette.text.secondary,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                transform: "translateY(-1px)",
              },
            }}
          >
            Dismiss
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CustomNotificationToast;
