import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const NotFound = () => {
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
          padding: 4,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", sm: "8rem" },
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Page Not Found
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
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Please check the URL or return to the homepage.
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

export default NotFound;
