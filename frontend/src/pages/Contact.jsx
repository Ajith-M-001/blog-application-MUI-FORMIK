import { Container, Typography, useTheme } from "@mui/material";

const Contact = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="xl">
      <Typography sx={{ color: theme.palette.text.primary }}>
        Contact section
      </Typography>
    </Container>
  );
};

export default Contact;
