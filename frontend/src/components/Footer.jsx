import { alpha, Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        height: "60px",
        py: 2,
        textAlign: "center",
        backdropFilter: "blur(10px)",
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {currentYear} NEXUS Blog Platform. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export { Footer };
