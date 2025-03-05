import { Box, Container, Grid2, Typography } from "@mui/material";

const SignUp = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, sm: 4 },
        background: "linear-gradient(to bottom, white,rgb(3, 33, 63))",
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems={"center"}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box textAlign={{ xs: "center", md: "left" }}>
              <Typography variant="h2" color="text.primary">
                Join NEXUS
              </Typography>
              <Typography color="text.secondary">
                Create your account and start your blogging journey
              </Typography>
            </Box>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            sdfdf
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default SignUp;
