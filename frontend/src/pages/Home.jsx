import { Typography, useTheme } from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { showToast } from "../utils/toast";
import { useGetUserDetails } from "../features/auth/hooks/use-auth";
import {
  useIsAuthenticated,
  useUserActions,
} from "../features/auth/store/userStore";

const VerificationDrawer = lazy(() =>
  import("../components/Drawer/VerificationDrawer")
);

const Home = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const authMessage = urlParams.get("auth");

  console.log("Auth message", authMessage);
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

  return (
    <div>
      <Typography sx={{ color: theme.palette.text.primary }}>
        Home Page
      </Typography>

      {openDrawer && (
        <Suspense fallback={"loading..."}>
          <VerificationDrawer
            openDrawer={openDrawer}
            onClose={handleCloseDrawer}
            userData={userError?.response?.data?.data}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
