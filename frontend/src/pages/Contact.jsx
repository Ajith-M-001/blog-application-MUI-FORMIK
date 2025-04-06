import { Typography, useTheme } from "@mui/material";

const Contact = () => {
  const theme = useTheme();
  return (
    <Typography sx={{ color: theme.palette.text.primary }}>
      Contact section
    </Typography>
  );
};

export default Contact;
