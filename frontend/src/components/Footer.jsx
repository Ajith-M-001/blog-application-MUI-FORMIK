import { Box, Typography, useTheme } from "@mui/material";

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
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {currentYear} NEXUS Blog. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
