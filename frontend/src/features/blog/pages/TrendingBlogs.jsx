import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGetTrendingBlogs } from "../hooks/use-blog";
import { Eye, TrendingUp } from "lucide-react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { formatViews } from "../utils/formatViews";
import { motion } from "framer-motion";
import { TrendingPostSkeleton } from "../components/SkeltonsLoaders/TrendingPostSkeleton";

const MotionCard = motion(Card);

const TrendingBlogs = () => {
  const {
    data: trendingBlogs,
    isLoading: isLoadingTrendingBlogs,
    isError: isErrorTrendingBlogs,
    error: errorTrendingBlogs,
  } = useGetTrendingBlogs({}, { limit: 3 });

  if (isLoadingTrendingBlogs) return <TrendingPostSkeleton />;
  if (isErrorTrendingBlogs)
    return <div>Error: {errorTrendingBlogs.message}</div>;

  return (
    <Box>
      <Box sx={{ p: 2 }} display="flex">
        <Stack direction="row" alignItems="center" spacing={1}>
          <TrendingUp color="#f44336" size={24} />
          <Typography variant="h5" fontWeight="bold">
            Trending Blogs
          </Typography>
        </Stack>
      </Box>

      <Grid2 container spacing={2}>
        {trendingBlogs?.data?.map((blog, index) => {
          const createdAt = parseISO(blog?.createdAt);
          const daysAgo = differenceInCalendarDays(new Date(), createdAt);

          return (
            <Grid2 size={{ xs: 12 }} key={blog._id}>
              <MotionCard
                variant="outlined"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  p: 0.5,
                }}
              >
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ width: 30, textAlign: "center", pl: 1 }}
                >
                  {index + 1}
                </Typography>

                <CardMedia
                  component="img"
                  sx={{ width: 70, height: 60, borderRadius: 1, mx: 2 }}
                  image={blog.coverImage?.url}
                  alt={blog.title}
                />

                <CardContent sx={{ flex: 1, py: 1 }}>
                  <Tooltip title={blog.title} placement="top" arrow>
                    <Typography
                      variant="subtitle2"
                      fontWeight={500}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                      }}
                    >
                      {blog.title}
                    </Typography>
                  </Tooltip>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mt={0.5}
                  >
                    <Eye size={16} color="gray" />
                    <Typography variant="body2" color="text.secondary">
                      {formatViews(blog.blogActivity?.total_views || 0)} views
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {daysAgo === 0
                        ? "Today"
                        : daysAgo === 1
                        ? "1 day ago"
                        : `${daysAgo} days ago`}
                    </Typography>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>
          );
        })}
      </Grid2>
    </Box>
  );
};

export default TrendingBlogs;
