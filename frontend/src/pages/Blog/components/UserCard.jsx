import { Avatar, Box, Grid2, Typography, useTheme } from "@mui/material";
import { CalendarMonth, Schedule, Article } from "@mui/icons-material";
import { format } from "date-fns";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import useStore from "../../../store/zustand.store";
import { useShallow } from "zustand/react/shallow";

const UserCard = () => {
  const theme = useTheme();

  const { blog, user } = useStore(
    useShallow((state) => ({
      blog: state.blog,
      user: state.user,
    }))
  );

  console.log("UserCard", user, blog);

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`;
    }
    return user?.username[0]?.toUpperCase() || "";
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString || new Date()), "MMM dd, yyyy");
  };

  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        "&:hover": {
          boxShadow: theme.shadows[3],
        },
        transition: "box-shadow 0.3s ease",
      }}
    >
      <Grid2 container alignItems="center" spacing={3}>
        {/* Avatar Section */}
        <Grid2 item>
          <Avatar
            src={user?.avatar?.url}
            sx={{
              width: 54,
              height: 54,
              bgcolor: theme.palette.primary.main,
              fontSize: "1.5rem",
            }}
          >
            {getInitials()}
          </Avatar>
        </Grid2>

        {/* User Info Section */}
        <Grid2 item xs={6}>
          <Typography variant="h6" component="div">
            <Typography variant="h6" component="div">
              {capitalizeFirstLetter(user?.firstName)}{" "}
              {capitalizeFirstLetter(user?.lastName)}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{user?.username}
          </Typography>
        </Grid2>

        {/* Stats Section */}
        <Grid2 item xs={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <CalendarMonth fontSize="small" color="inherit" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {formatDate(blog?.scheduleDate || blog?.createdAt)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center" mr={2}>
              <Schedule fontSize="small" color="inherit" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {blog?.readingTime?.minutes || 0} min read
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Article fontSize="small" color="inherit" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {blog?.readingTime?.words || 0} words
              </Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export { UserCard };
