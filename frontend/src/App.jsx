// App.jsx
import { Button, Container, Typography } from "@mui/material";

function App({ toggleTheme, isDarkMode }) {
  return (
    <Container>
      <Typography variant="h1">My Blog</Typography>
      <Button variant="contained" onClick={toggleTheme} sx={{ mt: 2 }}>
        Switch to {isDarkMode ? "Light" : "Dark"} Mode
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={toggleTheme}
        sx={{ mt: 2 }}
      >
        secondary button
      </Button>
      {/* Rest of your app content */}
    </Container>
  );
}

export default App;
