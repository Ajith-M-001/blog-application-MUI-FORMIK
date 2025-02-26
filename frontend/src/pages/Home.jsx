import { Container, Typography, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="xl">
      <Typography sx={{ color: theme.palette.text.primary }}>
        Home section
      </Typography>
    </Container>
  );
};

export default Home;
