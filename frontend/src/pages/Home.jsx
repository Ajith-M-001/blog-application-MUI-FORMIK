import { Typography, useTheme } from "@mui/material";
import { useGetUserDetails } from "../hooks/api/Users";
import useStore from "../store/zustand.store";
import { useShallow } from "zustand/react/shallow";

const Home = () => {
  const { data: user, isSuccess } = useGetUserDetails();

  const { setUser, setIsAuthenticated } = useStore(
    useShallow((state) => ({
      setUser: state.setUser,
      setIsAuthenticated: state.setIsAuthenticated,
    }))
  );

  if (isSuccess) {
    setUser(user.data);
    setIsAuthenticated(true);
  }

  console.log(user);
  const theme = useTheme();
  return (
    <Typography sx={{ color: theme.palette.text.primary }}>
      Home Page
    </Typography>
  );
};

export default Home;
