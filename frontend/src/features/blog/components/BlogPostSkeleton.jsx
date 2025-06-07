import { Box, Divider, Grid2, Skeleton } from "@mui/material";
import PropTypes from "prop-types";

const BlogPostSkeleton = ({ count = 5 }) => {
  return (
    <Box>
      {[...Array(count)].map((_, index) => (
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
          <Divider sx={{ my: 2, width: "98%", mx: "auto" }} />
        </Box>
      ))}
    </Box>
  );
};

export { BlogPostSkeleton };

BlogPostSkeleton.propTypes = {
  count: PropTypes.number,
};
