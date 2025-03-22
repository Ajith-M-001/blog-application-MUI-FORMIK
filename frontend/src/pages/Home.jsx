import { Typography, useTheme } from "@mui/material";
import { useGetUserDetails } from "../hooks/api/Users";
import useStore from "../store/zustand.store";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

const Home = () => {
  // Get Zustand store actions
  const { setUser, setIsAuthenticated } = useStore(
    useShallow((state) => ({
      setUser: state.setUser,
      setIsAuthenticated: state.setIsAuthenticated,
    }))
  );

  const theme = useTheme();

  const { data: user, isSuccess: isUserSuccess } = useGetUserDetails();

  useEffect(() => {
    if (isUserSuccess && user?.data) {
      setUser(user?.data);
      setIsAuthenticated(true);
    }
  }, [isUserSuccess, user?.data]);

  console.log("User", user);

  console.log("Component rendered");

  return (
    <div>
      <Typography sx={{ color: theme.palette.text.primary }}>
        Home Page
      </Typography>
    </div>
  );
};

export default Home;
