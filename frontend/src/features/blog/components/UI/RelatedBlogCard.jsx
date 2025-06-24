import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

export function RelatedBlogCard({ blog }) {
  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
        textDecoration: "none",
        display: "block",
        cursor: "pointer",
      }}
      onClick={() => (window.location.href = `/blog/${blog.slug}`)}
    >
      {blog.coverImage?.url && (
        <Box
          sx={{
            position: "relative",
            aspectRatio: "16/9",
            overflow: "hidden",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <img
            src={blog.coverImage.url || "/placeholder.svg"}
            alt={blog.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.2s",
            }}
          />
          {blog.category?.name && (
            <Chip
              label={blog.category.name}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#333",
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      )}

      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {blog.title}
        </Typography>

        {blog.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
            noWrap
          >
            {blog.description}
          </Typography>
        )}

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar
            alt={blog.author?.username}
            src={blog.author?.avatar?.url || "/placeholder.svg"}
            sx={{ width: 24, height: 24, fontSize: 12 }}
          >
            {blog.author?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {blog.author?.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </Typography>
        </Box>

        {blog.readingTime?.minutes && (
          <Typography variant="caption" color="text.secondary">
            {blog.readingTime.minutes} min read
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// PropTypes for validation
RelatedBlogCard.propTypes = {
  blog: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.shape({
      url: PropTypes.string,
      public_id: PropTypes.string,
    }),
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    author: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
    createdAt: PropTypes.string.isRequired,
    readingTime: PropTypes.shape({
      minutes: PropTypes.number,
    }),
  }).isRequired,
};
