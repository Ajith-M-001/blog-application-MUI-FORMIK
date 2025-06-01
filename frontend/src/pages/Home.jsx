import {
  Box,
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
  const limit = 2;

  const params = cursor ? { cursor, limit } : { limit };

  const {
    data: latestBlogs,
    isLoading: isLatestBlogsLoading,
    isError: isLatestBlogsError,
    error: latestBlogsError,
  } = useGetAllBlogs({ staleTime: 60 * 1000, gcTime: 65 * 1000 }, params);

  console.log("Auth message", latestBlogs?.data);
  // Get Zustand store actions
  const isAuthenticated = useIsAuthenticated();

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
                blogs={latestBlogs?.data?.blogs}
                isLoading={isLatestBlogsLoading}
                isError={isLatestBlogsError}
                error={latestBlogsError}
              />
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
