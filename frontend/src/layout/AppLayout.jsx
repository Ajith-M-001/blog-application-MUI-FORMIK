import { Box, Container, useTheme } from "@mui/material";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router";

const AppLayout = () => {
  const theme = useTheme();
  return (
    <Box>
      <Header />
      <Box
        id="main-content"
        component={"main"}
        sx={{
          minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight + 4}px)`,
          width: "100%",
          pt: `${theme.mixins.toolbar.minHeight + 16}px`,
          pb: theme.spacing(1),
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
