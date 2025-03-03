import { Typography, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Typography sx={{ color: theme.palette.text.primary }}>
      Home Page
    </Typography>
  );
};

export default Home;
