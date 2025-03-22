import { Typography, useTheme } from "@mui/material";
import { useGetUserDetails } from "../hooks/api/Users";
import useStore from "../store/zustand.store";
import { useShallow } from "zustand/react/shallow";
import { lazy, Suspense, useEffect, useState } from "react";

const VerificationDrawer = lazy(() =>
  import("../components/Drawer/VerificationDrawer")
);

const Home = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  // Get Zustand store actions
  const { setUser, setIsAuthenticated } = useStore(
    useShallow((state) => ({
      setUser: state.setUser,
      setIsAuthenticated: state.setIsAuthenticated,
    }))
  );

  const theme = useTheme();

  const {
    data: user,
    isSuccess: isUserSuccess,
    error: userError,
  } = useGetUserDetails();

  useEffect(() => {
    if (isUserSuccess && user?.data) {
      setUser(user?.data);
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
