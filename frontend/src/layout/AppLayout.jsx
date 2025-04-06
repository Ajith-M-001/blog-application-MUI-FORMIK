import { Box, Container, useTheme } from "@mui/material";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router";

const AppLayout = () => {
  const theme = useTheme();
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        id="main-content"
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          pt: `${theme.mixins.toolbar["@media (min-width:600px)"].minHeight}px`,
          pb: theme.spacing(0.2),
        }}
      >
        <Container maxWidth="xl" sx={{ height: "100%"}}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
