// import { Avatar, Box, Grid2, Typography, useTheme } from "@mui/material";
// import { CalendarMonth, Schedule, Article } from "@mui/icons-material";
// import { format } from "date-fns";
// import { capitalizeFirstLetter } from "../../../shared/utils/capitalizeFirstLetter";
// import { useUserData } from "../../../shared/store/userStore";
// import { useBlogData } from "../../../shared/store/blogStore";

// const UserCard = () => {
//   const theme = useTheme();

//   const blog = useBlogData();
//   const user = useUserData();

//   // Get user initials for avatar fallback
//   const getInitials = () => {
//     if (user?.firstName && user?.lastName) {
//       return `${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`;
//     }
//     return user?.username[0]?.toUpperCase() || "";
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return format(new Date(dateString || new Date()), "MMM dd, yyyy");
//   };

//   return (
//     <Box
//       sx={{
//         p: 3,
//         mb: 1,
//         backgroundColor: theme.palette.background.default,
//       }}
//     >
//       <Grid2 container alignItems="center" spacing={3}>
//         {/* Avatar Section */}
//         <Grid2 item>
//           <Avatar
//             src={user?.avatar?.url}
//             sx={{
//               width: 54,
//               height: 54,
//               bgcolor: theme.palette.primary.main,
//               fontSize: "1.5rem",
//             }}
//           >
//             {getInitials()}
//           </Avatar>
//         </Grid2>

//         {/* User Info Section */}
//         <Grid2 item xs={6}>
//           <Typography variant="h6" component="div">
//             <Typography variant="h6" component="div">
//               {capitalizeFirstLetter(user?.firstName)}{" "}
//               {capitalizeFirstLetter(user?.lastName)}
//             </Typography>
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             @{user?.username}
//           </Typography>
//         </Grid2>

//         {/* Stats Section */}
//         <Grid2 item xs={4}>
//           <Box display="flex" alignItems="center" mb={1}>
//             <CalendarMonth fontSize="small" color="inherit" sx={{ mr: 1 }} />
//             <Typography variant="body2">
//               {formatDate(blog?.scheduleDate || blog?.createdAt)}
//             </Typography>
//           </Box>

//           <Box display="flex" alignItems="center">
//             <Box display="flex" alignItems="center" mr={2}>
//               <Schedule fontSize="small" color="inherit" sx={{ mr: 0.5 }} />
//               <Typography variant="body2">
//                 {blog?.readingTime?.minutes || 0} min read
//               </Typography>
//             </Box>

//             <Box display="flex" alignItems="center">
//               <Article fontSize="small" color="inherit" sx={{ mr: 0.5 }} />
//               <Typography variant="body2">
//                 {blog?.readingTime?.words || 0} words
//               </Typography>
//             </Box>
//           </Box>
//         </Grid2>
//       </Grid2>
//     </Box>
//   );
// };

// export { UserCard };

import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { CalendarMonth, Schedule, Article } from "@mui/icons-material";
import { format } from "date-fns";
import { capitalizeFirstLetter } from "../../../shared/utils/capitalizeFirstLetter";
import {
  useIsAuthenticated,
  useUserData,
} from "../../../shared/store/userStore";
import { useBlogData } from "../../../shared/store/blogStore";
import {
  useFollowUser,
  useUnfollowUser,
  useUserFollowingStatus,
} from "../../../shared/hooks/use-shared";
import QueryHandler from "../../../shared/QueryHandler";
import { isEmpty } from "../../../shared/utils/isEmpty";
import { useState } from "react";
import LoginDialog from "./UI/LoginDialog";

const UserCard = () => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const theme = useTheme();
  const blog = useBlogData();
  const user = useUserData();
  const isAuthenticated = useIsAuthenticated();

  const authorId = blog?.author?._id;

  const shouldShowFollowButton = user?._id !== authorId;

  console.log("authorId", blog);

  const {
    data: isFollowingData,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
    error: followingError,
    isFetching: isFollowingFetching,
    refetch: refetchFollowingStatus,
  } = useUserFollowingStatus(authorId, {
    enabled: isAuthenticated && !!authorId && user?._id !== authorId,
  });

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  const { mutate: follow, isPending: isFollowPending } =
    useFollowUser(authorId);
  const { mutate: unfollow, isPending: isUnfollowPending } =
    useUnfollowUser(authorId);

  const isDataEmpty =
    !isFollowingLoading && !isFollowingError && isEmpty(isFollowingData?.data);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      // Open login dialog if user is not authenticated
      setLoginDialogOpen(true);
      return;
    }
    if (isFollowingData?.data?.isFollowing) {
      unfollow({ userIdToUnfollow: authorId });
    } else {
      follow({ userIdToFollow: authorId });
    }
  };

  const getInitials = () => {
    if (blog?.author?.firstName && blog?.author?.lastName) {
      return `${blog?.author?.firstName[0].toUpperCase()}${blog?.author.lastName[0].toUpperCase()}`;
    }
    return blog?.author?.username[0]?.toUpperCase() || "";
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString || new Date()), "MMM dd, yyyy");
  };

  return (
    <>
      <QueryHandler
        isLoading={isFollowingLoading}
        isError={isFollowingError}
        error={followingError}
        onRefresh={refetchFollowingStatus}
        showRetryButton={true}
        retryAttempts={3}
        isRefetching={isFollowingFetching}
        isEmpty={isAuthenticated ? isDataEmpty : false}
      >
        <Box
          sx={{
            p: 3,
            mb: 1,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Avatar and User Info */}
            <Box
              display="flex"
              alignItems="center"
              flex="1"
              minWidth="250px"
              gap={2}
            >
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

              <Box>
                <Typography variant="h6">
                  {capitalizeFirstLetter(blog?.author?.firstName)}{" "}
                  {capitalizeFirstLetter(blog?.author?.lastName)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{blog?.author?.username}
                </Typography>
              </Box>
              {/* Follow Button */}
              {shouldShowFollowButton && (
                <Box ml={3}>
                  <Button
                    variant={
                      isAuthenticated && isFollowingData?.data?.isFollowing
                        ? "outlined"
                        : "contained"
                    }
                    size="medium"
                    onClick={handleFollowToggle}
                    disabled={
                      isAuthenticated && (isFollowPending || isUnfollowPending)
                    }
                    sx={{ px: 5 }}
                  >
                    {isAuthenticated && isFollowingData?.data?.isFollowing
                      ? "Following"
                      : "Follow"}
                  </Button>
                </Box>
              )}
            </Box>

            {/* Blog Stats */}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              mt={{ xs: 2, sm: 0 }}
              minWidth="200px"
            >
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarMonth fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {formatDate(blog?.scheduleDate || blog?.createdAt)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Box display="flex" alignItems="center" mr={2}>
                  <Schedule fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {blog?.readingTime?.minutes || 0} min read
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Article fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {blog?.readingTime?.words || 0} words
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </QueryHandler>
      <LoginDialog open={loginDialogOpen} onClose={handleCloseLoginDialog} />
    </>
  );
};

export { UserCard };
