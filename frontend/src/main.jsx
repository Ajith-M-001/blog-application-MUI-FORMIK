import "@fontsource-variable/inter"; // Supports weights 100-900
import "@fontsource-variable/open-sans"; // Supports weights 300-800
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotificationToaster } from "./shared/components/Toaster/Toaster.jsx";
import "./index.css";
import { darkTheme, lightTheme } from "./theme.js";
import queryClient from "./api/queryClient.js";
import App from "./app/App.jsx";
import { useIsDarkTheme } from "./shared/store/themeStore.js";

const RootApp = () => {
  const isDarkTheme = useIsDarkTheme();

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme="true" />
      <App />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootApp />
      <NotificationToaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
