import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const Unauthorized = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        p: 3,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ShieldAlert
            size={60}
            color={theme.palette.error.main}
            style={{ marginBottom: "1rem" }}
          />
        </motion.div>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", sm: "6rem" },
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          403
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Access Denied
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          You don&apos;t have permission to access this page. Please sign in
          with appropriate credentials or return to the homepage.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            startIcon={<Home size={18} />}
            onClick={() => navigate("/")}
            color="error"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Home Page
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Unauthorized;
