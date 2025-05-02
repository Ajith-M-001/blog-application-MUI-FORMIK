import "@fontsource-variable/inter"; // Supports weights 100-900
import "@fontsource-variable/open-sans"; // Supports weights 300-800
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { NotificationToaster } from "./components/Toaster.jsx";
import "./index.css";
import { useIsDarkTheme } from "./store/zustand.store.js";
import { darkTheme, lightTheme } from "./theme.js";

const RootApp = () => {
  const isDarkTheme = useIsDarkTheme();

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme="true" />
      <App />
    </ThemeProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        // Don't retry on 401 - interceptor handles this
        return error?.response?.status !== 401 && failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 10, // Ensure garbage collection matches cache time
      networkMode: "online",
      // onError: (error) => console.error("Query Error:", error),
    },
    mutations: {
      // onError: (error) => console.error("Mutation Error:", error),
      retry: (failureCount, error) => {
        // Don't retry on 401 - interceptor handles this
        return error?.response?.status !== 401 && failureCount < 1;
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootApp />
      <NotificationToaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
