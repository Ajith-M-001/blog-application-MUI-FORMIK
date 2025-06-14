import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";
import {
  Lock,
  UserRound,
  LogIn,
  UserPlus,
  Heart,
  MessageSquare,
  Bookmark,
  Headphones,
} from "lucide-react"; // Import Lucide icons
import PropTypes from "prop-types";

// Action type configurations
const ACTION_CONFIGS = {
  follow: {
    icon: UserPlus,
    title: "Follow Author",
    message: "You need to be logged in to follow this author",
    description: "Follow authors to get notified about their latest posts",
  },
  like: {
    icon: Heart,
    title: "Like Post",
    message: "You need to be logged in to like this post",
    description: "Show your appreciation by liking posts you enjoy",
  },
  comment: {
    icon: MessageSquare,
    title: "Add Comment",
    message: "You need to be logged in to comment on this post",
    description: "Join the conversation and share your thoughts",
  },
  bookmark: {
    icon: Bookmark,
    title: "Bookmark Post",
    message: "You need to be logged in to bookmark this post",
    description: "Save posts to read later in your personal collection",
  },
  listen: {
    icon: Headphones,
    title: "Listen to Post",
    message: "You need to be logged in to listen to this post",
    description: "Enjoy audio versions of your favorite articles",
  },
  // share: {
  //   icon: Share2,
  //   title: "Share Post",
  //   message: "You need to be logged in to share this post",
  //   description: "Share interesting content with your network",
  // },
  default: {
    icon: Lock,
    title: "Authentication Required",
    message: "You need to be logged in to perform this action",
    description: "Please log in or create an account to continue",
  },
};

const LoginDialog = ({
  open,
  onClose,
  actionType = "default",
  customTitle,
  customMessage,
  customDescription,
  showSignUpOption = true,
  primaryButtonText = "Log In",
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Get configuration for the action type
  const config = ACTION_CONFIGS[actionType] || ACTION_CONFIGS.default;
  const ActionIcon = config.icon;

  // Use custom props or fall back to config defaults
  const title = customTitle || config.title;
  const message = customMessage || config.message;
  const description = customDescription || config.description;

  const handleLogin = () => {
    onClose();
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    onClose();
    navigate("/sign-up");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            textAlign: "center",
            py: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ py: 2 }}>
        <Box display="flex" justifyContent="center" mb={1}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: `${theme.palette.primary.main}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <ActionIcon
              size={32}
              color={theme.palette.primary.main}
              strokeWidth={1.5}
            />
          </Box>
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 2 }}>
        <Box py={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
          >
            <UserRound size={20} style={{ marginRight: 8 }} />
            <Typography variant="body1" fontWeight={500}>
              {message}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              backgroundColor: "action.hover",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            <LogIn size={16} style={{ marginRight: 8, flexShrink: 0 }} />
            {description}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          px: 4,
          pt: 1,
          pb: 3,
          flexDirection: showSignUpOption ? "column" : "row",
          gap: showSignUpOption ? 2 : 1,
        }}
      >
        {showSignUpOption && (
          <Box display="flex" width="100%" gap={1}>
            <Button
              onClick={handleSignUp}
              variant="contained"
              color="primary"
              endIcon={<UserPlus size={18} />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                flex: 1,
                fontWeight: 600,
              }}
            >
              Create Account
            </Button>
            <Button
              onClick={handleLogin}
              variant="outlined"
              color="primary"
              endIcon={<LogIn size={18} />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                flex: 1,
                fontWeight: 600,
              }}
            >
              {primaryButtonText}
            </Button>
          </Box>
        )}

        <Button
          onClick={onClose}
          color="inherit"
          variant="text"
          size="small"
          sx={{
            mt: showSignUpOption ? 1 : 0,
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "transparent",
              color: "text.primary",
            },
          }}
        >
          Maybe later
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;

LoginDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionType: PropTypes.oneOf([
    "follow",
    "like",
    "comment",
    "bookmark",
    "listen",
    "share",
    "default",
  ]),
  customTitle: PropTypes.string,
  customMessage: PropTypes.string,
  customDescription: PropTypes.string,
  showSignUpOption: PropTypes.bool,
  primaryButtonText: PropTypes.string,
};
