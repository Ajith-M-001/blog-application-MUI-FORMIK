import {
  Box,
  Card,
  CardContent,
  Grid2,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { TrendingUp } from "lucide-react";
import PropTypes from "prop-types";

const TrendingPostSkeleton = ({ count = 3 }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ p: 2 }} display="flex">
        <Stack direction="row" alignItems="center" spacing={1}>
          <TrendingUp color="#f44336" size={24} />
          <Typography variant="h5" fontWeight="bold">
            Trending Blogs
          </Typography>
        </Stack>
      </Box>
      {[...Array(count)].map((_, index) => (
        <Grid2 size={{ xs: 12 }} key={`skeleton-${index}`} sx={{ mb: 2.5 }}>
          <Card
            variant="outlined"
            sx={{ display: "flex", alignItems: "center", p: 0.5 }}
          >
            <Skeleton variant="text" width={30} height={30} sx={{ ml: 1 }} />
            <Skeleton
              variant="rectangular"
              width={70}
              height={60}
              sx={{ borderRadius: 1, mx: 2 }}
            />
            <CardContent sx={{ flex: 1, py: 1 }}>
              <Skeleton variant="text" width="100%" height={20} />
              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <Skeleton variant="text" width={40} height={16} />
                <Skeleton variant="text" width={60} height={16} />
                <Skeleton variant="text" width={50} height={16} />
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Box>
  );
};

TrendingPostSkeleton.propTypes = {
  count: PropTypes.number,
};

export { TrendingPostSkeleton };
