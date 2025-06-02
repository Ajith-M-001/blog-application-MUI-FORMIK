import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid2,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "motion/react";
import { Bookmark, Eye, Heart, MessageSquare, Timer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

const BlogPostSkeleton = () => {
  return (
    <Box>
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ p: 2, gap: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, lg: 8 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 0.5,
                }}
              >
                <Skeleton variant="rectangular" width={80} height={30} />
                <Skeleton variant="text" width={100} />
              </Box>
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Skeleton variant="circular" width={40} height={40} />

                <Box>
                  <Box>
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={80} />
                  </Box>
                </Box>
              </Box>
            </Grid2>
            <Grid2
              size={{ xs: 12, lg: 4 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height="80%"
                sx={{ aspectRatio: "16/9", borderRadius: "5px" }}
              />
            </Grid2>
          </Grid2>
          <Divider sx={{ my: 2, width: "98%", mx: "auto" }} />{" "}
        </Box>
      ))}
    </Box>
  );
};

const BlogPost = ({ blogs = [], isLoading, isError, error }) => {
  const theme = useTheme();

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  if (isLoading) return <BlogPostSkeleton />;
  if (isError) return <Typography>Error: {error?.message}</Typography>;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <Box>
      {blogs.map((blog, index) => (
        <motion.div
          key={blog._id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 0.98 }}
          style={{
            marginBottom: "16px",
          }}
          role="article"
          aria-labelledby={`blog-title-${blog._id}`}
        >
          <Box sx={{ p: 2, gap: 2, cursor: "pointer" }}>
            <Grid2
              container
              spacing={2}
              sx={{
                backgroundColor: theme.palette.background.default,
                display: "flex",
                flexDirection: { xs: "column-reverse", lg: "row" },
              }}
            >
              <Grid2 size={{ xs: 12, lg: 8 }} sx={{ position: "relative" }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Chip label={blog?.category?.name} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Timer size={16} /> {blog?.readingTime?.minutes} min read
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  id={`blog-title-${blog._id}`}
                  sx={{
                    fontSize: { xs: "1.5rem", lg: "2rem" },
                    fontWeight: 600,
                    transition: "color 0.3s ease",

                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {blog?.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {blog?.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    mt: "12px",
                  }}
                >
                  <Avatar
                    src={blog?.author?.avatar?.url || "/fallback-avatar.jpg"}
                    alt={blog?.author?.username.toUpperCase() || "Author"}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {blog?.author?.username}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {formatDistanceToNow(new Date(blog?.createdAt), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: "12px",
                  }}
                >
                  <Box sx={{ display: "flex", gap: "12px" }}>
                    <Tooltip
                      title={`${blog.blogActivity.total_views} views`}
                      aria-label="views"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "text.secondary" }}
                        >
                          <Eye size={20} />
                        </IconButton>
                        <Typography variant="body2">
                          {formatNumber(blog.blogActivity.total_views)}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip
                      title={`${blog.blogActivity.total_likes} likes`}
                      aria-label="likes"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: isLiked ? "primary.main" : "text.secondary",
                            "&:hover": {
                              color: "primary.main",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.3s",
                          }}
                          onClick={() => setIsLiked(!isLiked)}
                          aria-pressed={isLiked}
                        >
                          <Heart
                            size={20}
                            fill={isLiked ? theme.palette.primary.main : "none"}
                          />
                        </IconButton>
                        <Typography variant="body2">
                          {formatNumber(blog.blogActivity.total_likes)}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip
                      title={`${blog.blogActivity.total_comments} comments`}
                      aria-label="comments"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "text.secondary" }}
                        >
                          <MessageSquare size={20} />
                        </IconButton>
                        <Typography variant="body2">
                          {formatNumber(blog.blogActivity.total_comments)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                  <Tooltip
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                    aria-label="bookmark"
                  >
                    <IconButton
                      size="small"
                      sx={{
                        color: isBookmarked ? "primary.main" : "text.secondary",
                        "&:hover": {
                          color: "primary.main",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s",
                      }}
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      aria-pressed={isBookmarked}
                    >
                      <Bookmark
                        size={20}
                        fill={
                          isBookmarked ? theme.palette.primary.main : "none"
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid2>
              <Grid2
                size={{ xs: 12, lg: 4 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src={blog?.coverImage?.url || "/fallback-image.jpg"}
                  alt={blog?.title || "Blog cover image"}
                  loading="lazy"
                  sx={{
                    border: "1px solid",
                    borderRadius: "5px",
                    objectFit: "cover",
                    aspectRatio: "16/9",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.03)" },
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(37, 99, 235, 0.2)",
                  }}
                />
              </Grid2>
            </Grid2>
          </Box>
          <Divider sx={{ my: 2, width: "98%", mx: "auto" }} />{" "}
        </motion.div>
      ))}
    </Box>
  );
};

BlogPost.propTypes = {
  blogs: PropTypes.array,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.object,
};

export default BlogPost;
