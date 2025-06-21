import { Box, Divider, Grid2, Tab, Tabs, useTheme } from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { useGetUserDetails } from "../features/auth/hooks/use-auth";
import { useIsAuthenticated, useUserActions } from "../shared/store/userStore";
import { showToast } from "../shared/utils/toast";
import PopularCategory from "../features/blog/pages/PopularCategory";
import FCMService from "../services/FCMService";
const VerificationDrawer = lazy(() =>
  import("../features/auth/components/VerificationDrawer")
);
const ForYouBlogs = lazy(() => import("../features/blog/pages/ForyouBlogs"));
const LatestBlogs = lazy(() => import("../features/blog/pages/LatestBlogs"));
const TrendingBlogs = lazy(() =>
  import("../features/blog/pages/TrendingBlogs")
);

// Constants
const TAB_INDICES = {
  LATEST: 0,
  FOR_YOU: 1,
};

// Components
const TabNavigation = ({ tabIndex, onTabChange, isAuthenticated }) => {
  if (!isAuthenticated) return null;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", my: 2 }}>
      <Tabs value={tabIndex} onChange={onTabChange} aria-label="home page tabs">
        <Tab label="Latest Blogs" />
        <Tab label="For You" />
      </Tabs>
    </Box>
  );
};

const fcm = new FCMService({
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
});

const Home = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tabIndex, setTabIndex] = useState(TAB_INDICES.LATEST);
  const urlParams = new URLSearchParams(window.location.search);
  const authMessage = urlParams.get("auth");

  useEffect(() => {
    const userId = "123"; // get from auth context
    fcm.initialize(userId);
  }, []);

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

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  console.log("Component rendered");

  // Determine which content to show
  const showLatestTab = !isAuthenticated || tabIndex === TAB_INDICES.LATEST;
  const showForYouTab = isAuthenticated && tabIndex === TAB_INDICES.FOR_YOU;

  return (
    <>
      <Grid2 container spacing={2} sx={{ height: "100%" }}>
        <Grid2 size={{ xs: 12, md: 8.8 }}>
          <TabNavigation
            tabIndex={tabIndex}
            onTabChange={handleTabChange}
            isAuthenticated={isAuthenticated}
          />
          {showLatestTab && <LatestBlogs />}
          {showForYouTab && <ForYouBlogs />}
        </Grid2>
        <Divider orientation="vertical" flexItem />
        <Grid2 size={{ xs: 12, md: 3 }}>
          <TrendingBlogs />
          <PopularCategory />
        </Grid2>
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
