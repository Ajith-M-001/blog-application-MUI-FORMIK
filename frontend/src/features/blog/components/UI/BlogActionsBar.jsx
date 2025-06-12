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
import { memo } from "react";
import { formatViews } from "../../utils/formatViews";
import { motion } from "framer-motion";
import { useBlogData } from "../../../../shared/store/blogStore";

const MotionStack = motion(Stack);
const MotionIconButton = motion(IconButton);
const MotionTypography = motion(Typography);

const BlogActionsBar = memo(() => {
  const theme = useTheme();
  const blog = useBlogData();
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

  return (
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
          title={`${formatViews(blog?.blogActivity?.total_likes)} likes`}
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
          title={`${formatViews(blog?.blogActivity?.total_comments)} comments`}
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
          title={`${formatViews(blog?.blogActivity?.total_bookmarks)} bookmarks`}
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
        <Tooltip title="Listen" placement="top" arrow>
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
