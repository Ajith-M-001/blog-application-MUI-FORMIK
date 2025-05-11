import { QueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/utils/toast";

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
      onError: (error) => {
        console.log("Error signing up user", error?.response?.data);
        showToast(error?.response?.data?.message, { type: "error" });
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
      onSuccess: (data) => {
        showToast(data?.message, { type: "success" });
      },
      onError: (error) => {
        console.log("Error signing up user", error?.response?.data);
        showToast(error?.response?.data?.message, { type: "error" });
      },
    },
  },
});

export default queryClient;
