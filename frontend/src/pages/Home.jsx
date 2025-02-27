import { Typography, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Typography sx={{ color: theme.palette.text.primary }}>
      Home section
    </Typography>
  );
};

export default Home;
