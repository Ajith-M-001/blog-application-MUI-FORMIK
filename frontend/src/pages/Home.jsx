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
import BlogPost from "../components/UI/BlogPost";
import { useInView } from "react-intersection-observer";
import { useInfiniteGetAllBlogs } from "../features/blog/hooks/use-blog";
import { debounce } from "lodash";
const VerificationDrawer = lazy(() =>
  import("../features/auth/components/VerificationDrawer")
);

const Home = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const urlParams = new URLSearchParams(window.location.search);
  const authMessage = urlParams.get("auth");

  const { ref, inView } = useInView({
    threshold: 0, // Trigger when the element is fully in view
    rootMargin: "100px", // Trigger 200px before the element is visible
  });

  // Get Zustand store actions
  const isAuthenticated = useIsAuthenticated();
  const { setUserData, setIsAuthenticated } = useUserActions();
  const theme = useTheme();

  const limit = 10;

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

  const {
    data: infiniteBlogs,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError: isInfiniteBlogsError,
    error: infiniteBlogsError,
    refetch,
  } = useInfiniteGetAllBlogs({}, { limit });

  // Debounced fetchNextPage to prevent rapid calls
  const debouncedFetchNextPage = debounce(fetchNextPage, 300);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      debouncedFetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, debouncedFetchNextPage]);

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

  const allBlogs =
    infiniteBlogs?.pages.flatMap((page) => page.data.blogs) || [];

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
                isLoading={isFetching && !isFetchingNextPage}
                isError={isInfiniteBlogsError}
                error={infiniteBlogsError}
              />
              {isInfiniteBlogsError && (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography color="error">
                    {infiniteBlogsError?.message}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => refetch()}
                    sx={{ mt: 1 }}
                  >
                    Retry
                  </Button>
                </Box>
              )}
              <Box
                ref={ref}
                sx={{
                  height: "20px",
                  display: hasNextPage ? "block" : "none",
                  textAlign: "center",
                  py: 2,
                }}
              >
                {isFetchingNextPage && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "center",
                      mb: 3,
                      py: 2,
                    }}
                  >
                    <CircularProgress
                      color="primary"
                      size={30}
                      thickness={4}
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body1" color="text.primary">
                      Loading more blogs...
                    </Typography>
                  </Box>
                )}
              </Box>
              {!hasNextPage && allBlogs.length > 0 && (
                <Typography sx={{ textAlign: "center", py: 2 }}>
                  No more blogs to load
                </Typography>
              )}
              {!hasNextPage && allBlogs.length === 0 && (
                <Typography sx={{ textAlign: "center", py: 2 }}>
                  No blogs available
                </Typography>
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
