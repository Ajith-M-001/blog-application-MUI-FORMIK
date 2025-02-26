import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
<<<<<<< HEAD
import "@fontsource-variable/inter"; // Supports weights 100-900
import "@fontsource-variable/open-sans"; // Supports weights 300-800
=======
import "./index.js";
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme.js";
const RootApp = () => {
<<<<<<< HEAD
  const [isDarkMode, setIsDarkMode] = useState(true);
=======
  const [isDarkMode, setIsDarkMode] = useState(false);
>>>>>>> 5d5a56cc09247243475a0f16cd3709649a8587a5

  const toggleTheme = () => {
    setIsDarkMode((previous) => !previous);
  };
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <App toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
