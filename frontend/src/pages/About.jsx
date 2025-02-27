import { Typography, useTheme } from "@mui/material";

const About = () => {
  const theme = useTheme();
  return (
    <Typography sx={{ color: theme.palette.text.primary }}>
      About section
    </Typography>
  );
};

export default About;
