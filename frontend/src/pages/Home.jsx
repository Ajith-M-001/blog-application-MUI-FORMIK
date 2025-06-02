import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid2,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { showToast } from "../shared/utils/toast";
import { useIsAuthenticated, useUserActions } from "../shared/store/userStore";
import { useGetUserDetails } from "../features/auth/hooks/use-auth";
import { useGetAllBlogs } from "../features/blog/hooks/use-blog";
import BlogPost from "../components/UI/BlogPost";

const VerificationDrawer = lazy(() =>
  import("../features/auth/components/VerificationDrawer")
);

const Home = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const urlParams = new URLSearchParams(window.location.search);
  const authMessage = urlParams.get("auth");

  const [cursor, setCursor] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 10;

  const params = cursor ? { cursor, limit } : { limit };

  const {
    data: latestBlogs,
    isLoading: isLatestBlogsLoading,
    isError: isLatestBlogsError,
    error: latestBlogsError,
    refetch: refetchBlogs,
    isFetching: isFetchingBlogs,
    isRefetching: isRefetchingBlogs,
    isPending: isPendingBlogs,
  } = useGetAllBlogs({ staleTime: 60 * 1000, gcTime: 65 * 1000 }, params);

  console.log("Auth message", latestBlogs?.data);
  console.log("isLoading ", isLatestBlogsLoading);
  console.log("isPending ", isPendingBlogs);
  console.log("isFetching ", isFetchingBlogs);
  console.log("isRefetching ", isRefetchingBlogs);
  // Get Zustand store actions
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (latestBlogs?.data) {
      if (cursor === null) {
        setAllBlogs(latestBlogs?.data?.blogs || []);
      } else {
        // Load more - append new blogs
        setAllBlogs((prev) => [...prev, ...(latestBlogs.data.blogs || [])]);
        setIsLoadingMore(false);
      }

      setNextCursor(latestBlogs?.data?.nextCursor || null);
    }
  }, [latestBlogs, cursor]);

  const { setUserData, setIsAuthenticated } = useUserActions();

  const theme = useTheme();

  const {
    data: user,
    isSuccess: isUserSuccess,
    error: userError,
  } = useGetUserDetails({
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 60 * 1000,
    cacheTime: 1 * 70 * 60 * 1000,
    gcTime: 1 * 70 * 60 * 1000,
  });

  useEffect(() => {
    if (authMessage === "google_auth_success") {
      setIsAuthenticated(true);
      showToast("google authentication successful", { type: "success" });
      // Optionally remove the parameter from URL for cleaner UX
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [authMessage, setIsAuthenticated]);

  useEffect(() => {
    if (isUserSuccess && user?.data) {
      setUserData(user?.data);
      setIsAuthenticated(true);
    }

    if (
      userError?.response?.data?.status === 403 &&
      userError?.response?.data?.message?.includes("Account is inactive")
    ) {
      setOpenDrawer(true);
    }
  }, [isUserSuccess, user?.data, userError]);

  console.log("User", user);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  console.log("Component rendered");

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle load more functionality
  const handleLoadMore = async () => {
    if (nextCursor && !isLoadingMore) {
      setIsLoadingMore(true);
      setCursor(nextCursor);
      try {
        await refetchBlogs();
      } catch (error) {
        console.error("Error loading more blogs:", error);
        showToast("Failed to load more blogs", { type: "error" });
        setIsLoadingMore(false);
      }
    }
  };

  return (
    <>
      <Grid2 container spacing={2} sx={{ height: "100%" }}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", my: 2 }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="home page tabs"
            >
              <Tab label="Latest Blogs" />
              <Tab label="For You" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {tabIndex === 0 && (
            <Box>
              <BlogPost
                blogs={allBlogs}
                isLoading={isLatestBlogsLoading && cursor === null}
                isError={isLatestBlogsError}
                error={latestBlogsError}
              />
              {/* Load More Button */}
              {nextCursor && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    startIcon={isLoadingMore && <CircularProgress size={20} />}
                    sx={{
                      minWidth: 150,
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </Button>
                </Box>
              )}

              {/* Show message when no more blogs */}
              {!nextCursor && allBlogs.length > 0 && (
                <Box sx={{ textAlign: "center", mt: 3, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    You&apos;ve reached the end of the blogs
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6">For You</Typography>
              {/* Replace with real personalized content */}
              <Typography>Here are blogs curated just for you...</Typography>
            </Box>
          )}
        </Grid2>
        <Divider orientation="vertical" />
        <Grid2 size={{ xs: 12, md: 4 }}></Grid2>
      </Grid2>

      {openDrawer && (
        <Suspense fallback={"loading..."}>
          <VerificationDrawer
            openDrawer={openDrawer}
            onClose={handleCloseDrawer}
            userData={userError?.response?.data?.data}
          />
        </Suspense>
      )}
    </>
  );
};

export default Home;
