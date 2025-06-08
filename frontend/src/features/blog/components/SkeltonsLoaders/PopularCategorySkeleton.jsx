import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { FolderKanban } from "lucide-react";
import PropTypes from "prop-types";

const PopularCategorySkeleton = ({ count = 6 }) => {
  return (
    <Box sx={{ px: 1, py: 5 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <FolderKanban size={22} color="gray" style={{ marginRight: 10 }} />
        <Typography variant="h6" fontWeight={600}>
          Popular Categories
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            width={100 + Math.random() * 50}
            height={32}
            sx={{ borderRadius: "16px" }}
          />
        ))}
      </Stack>
    </Box>
  );
};

PopularCategorySkeleton.propTypes = {
  count: PropTypes.number,
};

export default PopularCategorySkeleton;
