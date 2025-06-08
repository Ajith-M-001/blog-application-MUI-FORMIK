import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useGetPopularCategories } from "../hooks/use-blog";
import { FolderKanban } from "lucide-react";
import { motion } from "motion/react";
import PopularCategorySkeleton from "../components/SkeltonsLoaders/PopularCategorySkeleton";

const MotionChip = motion(Chip);

const PopularCategory = () => {
  const theme = useTheme();
  const {
    data: popularCategories,
    isLoading: isPopularCategoriesLoading,
    isError: isPopularCategoriesError,
    error: popularCategoriesError,
  } = useGetPopularCategories();
  console.log("popularCategories", popularCategories);

  if (isPopularCategoriesLoading) return <PopularCategorySkeleton />;
  if (isPopularCategoriesError)
    return <div>Error: {popularCategoriesError.message}</div>;

  return (
    <Box
      sx={{ px: 1, py: 5 }}
      data-testid="popular-category"
      id="popular-category"
    >
      <Box display="flex" alignItems="center" mb={3}>
        <FolderKanban
          size={22}
          color={theme.palette.primary.main}
          style={{ marginRight: 10 }}
        />
        <Typography variant="h6" fontWeight={600}>
          Popular Categories
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {popularCategories?.data?.map((cat) => (
          <MotionChip
            key={cat._id}
            label={cat.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            variant="outlined"
            clickable
            sx={{
              borderRadius: "16px",
              fontWeight: 500,
              px: 2,
              py: 0.5,
              fontSize: "0.875rem",
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default PopularCategory;
