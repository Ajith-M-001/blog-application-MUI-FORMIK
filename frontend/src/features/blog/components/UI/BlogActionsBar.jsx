import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bookmark,
  Eye,
  Headphones,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import { formatViews } from "../../utils/formatViews";
import { motion } from "motion/react";
import { useBlogData } from "../../../../shared/store/blogStore";
import { useIsAuthenticated } from "../../../../shared/store/userStore";
import LoginDialog from "./LoginDialog";

const MotionStack = motion.create(Stack);
const MotionIconButton = motion.create(IconButton);
const MotionTypography = motion.create(Typography);

const BlogActionsBar = memo(() => {
  const theme = useTheme();
  const blog = useBlogData();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("default");

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
    setCurrentAction("default");
  };

  const isAuthenticated = useIsAuthenticated();

  console.log("isAuthenticated", isAuthenticated);
  const isLiked = false;

  // Custom motion variants for each icon group
  const likeVariants = {
    rest: { color: theme.palette.text.secondary, scale: 1 },
    hover: { color: theme.palette.error.main, scale: 1.05 },
  };

  const commentVariants = {
    rest: { color: theme.palette.text.secondary, scale: 1 },
    hover: { color: theme.palette.warning.main, scale: 1.05 },
  };

  const bookmarkVariants = {
    rest: { color: theme.palette.text.secondary, scale: 1 },
    hover: { color: theme.palette.primary.main, scale: 1.05 },
  };

  const listenVariants = {
    rest: { color: theme.palette.text.secondary, scale: 1 },
    hover: { color: theme.palette.success.main, scale: 1.05 },
  };

  const shareVariants = {
    rest: { color: theme.palette.text.secondary, scale: 1 },
    hover: { color: theme.palette.info.main, scale: 1.05 },
  };

  const textVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const handleAuthRequiredAction = (action) => {
    if (!isAuthenticated) {
      setCurrentAction(action);
      setLoginDialogOpen(true);
      return;
    }

    switch (action) {
      case "like":
        console.log("Like action");
        break;
      case "comment":
        console.log("Comment action");
        break;
      case "bookmark":
        console.log("Bookmark action");
        break;
      case "listen":
        console.log("Listen action");
        break;
      case "share":
        console.log("Share action");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 4,
          mb: 1,
        }}
      >
        {/* Left Section */}
        <Stack direction="row" spacing={4} alignItems="center">
          {/* Views - static */}
          <Tooltip
            placement="top"
            arrow
            title={`${formatViews(blog?.blogActivity?.total_views)} views`}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              color="text.secondary"
            >
              <Eye size={30} />
              <Typography variant="h5" fontWeight={500}>
                {formatViews(blog?.blogActivity?.total_views)}
              </Typography>
            </Stack>
          </Tooltip>

          {/* Likes */}
          <Tooltip
            placement="top"
            arrow
            title={
              isAuthenticated
                ? `${formatViews(blog?.blogActivity?.total_likes)} likes`
                : "Sign in to like this blog"
            }
          >
            <MotionStack
              direction="row"
              spacing={1}
              alignItems="center"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={likeVariants}
              sx={{ cursor: "pointer" }}
            >
              <MotionIconButton
                color="inherit"
                variants={likeVariants}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => handleAuthRequiredAction("like")}
              >
                <Heart
                  size={30}
                  fill={isLiked ? theme.palette.error.main : "none"}
                  color={isLiked ? theme.palette.error.main : undefined}
                />
              </MotionIconButton>
              <MotionTypography
                variant="h5"
                fontWeight={500}
                variants={textVariants}
                transition={{ duration: 0.2 }}
              >
                {formatViews(blog?.blogActivity?.total_likes)}
              </MotionTypography>
            </MotionStack>
          </Tooltip>

          {/* Comments */}
          <Tooltip
            placement="top"
            arrow
            title={
              isAuthenticated
                ? `${formatViews(blog?.blogActivity?.total_comments)} comments`
                : "Sign in to comment on this blog"
            }
          >
            <MotionStack
              direction="row"
              spacing={1}
              alignItems="center"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={commentVariants}
              sx={{ cursor: "pointer" }}
            >
              <MotionIconButton
                color="inherit"
                variants={commentVariants}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => handleAuthRequiredAction("comment")}
              >
                <MessageSquare size={30} />
              </MotionIconButton>
              <MotionTypography
                variant="h5"
                fontWeight={500}
                variants={textVariants}
                transition={{ duration: 0.2 }}
              >
                {formatViews(blog?.blogActivity?.total_comments)}
              </MotionTypography>
            </MotionStack>
          </Tooltip>
        </Stack>

        {/* Right Section */}
        <Stack direction="row" spacing={4} alignItems="center">
          {/* Bookmarks */}
          <Tooltip
            placement="top"
            arrow
            title={
              isAuthenticated
                ? `${formatViews(
                    blog?.blogActivity?.total_bookmarks
                  )} bookmarks`
                : "Sign in to bookmark this blog"
            }
          >
            <MotionStack
              direction="row"
              spacing={1}
              alignItems="center"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={bookmarkVariants}
              sx={{ cursor: "pointer" }}
            >
              <MotionIconButton
                color="inherit"
                variants={bookmarkVariants}
                onClick={() => handleAuthRequiredAction("bookmark")}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Bookmark size={30} />
              </MotionIconButton>
              <MotionTypography
                variant="h5"
                fontWeight={500}
                variants={textVariants}
                transition={{ duration: 0.2 }}
              >
                {formatViews(blog?.blogActivity?.total_bookmarks)}
              </MotionTypography>
            </MotionStack>
          </Tooltip>

          {/* Listen */}
          <Tooltip
            title={
              isAuthenticated ? "Listen" : "Sign in to listen to this blog"
            }
            placement="top"
            arrow
          >
            <MotionStack
              direction="row"
              spacing={1}
              alignItems="center"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={listenVariants}
              sx={{ cursor: "pointer" }}
            >
              <MotionIconButton
                color="inherit"
                variants={listenVariants}
                onClick={() => handleAuthRequiredAction("listen")}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Headphones size={30} />
              </MotionIconButton>
            </MotionStack>
          </Tooltip>

          {/* Share */}
          <Tooltip title="Share" placement="top" arrow>
            <MotionStack
              direction="row"
              spacing={1}
              alignItems="center"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={shareVariants}
              sx={{ cursor: "pointer" }}
            >
              <MotionIconButton
                color="inherit"
                variants={shareVariants}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Share2 size={30} />
              </MotionIconButton>
            </MotionStack>
          </Tooltip>
        </Stack>
      </Box>
      <LoginDialog
        actionType={currentAction}
        open={loginDialogOpen}
        onClose={handleCloseLoginDialog}
      />
    </>
  );
});

BlogActionsBar.displayName = "BlogActionsBar";

BlogActionsBar.propTypes = {
  blogActivity: PropTypes.shape({
    total_views: PropTypes.number,
    total_likes: PropTypes.number,
    total_comments: PropTypes.number,
    total_bookmarks: PropTypes.number,
  }),
};

export default BlogActionsBar;
