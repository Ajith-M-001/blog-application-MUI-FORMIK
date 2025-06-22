import "@fontsource-variable/inter"; // Supports weights 100-900
import "@fontsource-variable/open-sans"; // Supports weights 300-800
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { NotificationToaster } from "./shared/components/Toaster/Toaster.jsx";
import { darkTheme, lightTheme } from "./theme.js";
import queryClient from "./api/queryClient.js";
import App from "./app/App.jsx";
import { useIsDarkTheme } from "./shared/store/themeStore.js";
import "./index.css";
import { SocketProvider } from "./app/providers/SocketProvider";
import { BrowserRouter } from "react-router";
import ToastProvider from "./app/providers/ToastProvider.jsx";
import FCMService from "./services/FCMService.js";
import { useIsAuthenticated } from "./shared/store/userStore.js";

const fcm = new FCMService({
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
});
const RootApp = () => {
  const isDarkTheme = useIsDarkTheme();

  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    if (isAuthenticated) {
      fcm.initialize();

      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme="true" />
      <BrowserRouter>
        <ToastProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootApp />
      {/* <NotificationToaster /> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
