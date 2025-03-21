import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";
import useStore from "../store/zustand.store.js";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api/v1"
    : import.meta.env.VITE_API_BASE_URL;

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // No need to add token manually as cookies are sent automatically
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedRequestsQueue = [];
};

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url === API_ENDPOINTS.users.refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        await axiosInstance.post(
          API_ENDPOINTS.users.refreshToken,
          {},
          { withCredentials: true }
        );
        const retryResponse = await axiosInstance(originalRequest);
        processQueue(null);
        return retryResponse;
      } catch (refreshError) {
        logoutUser();
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      });
    }
  }
);

const logoutUser = () => {
  const { clearUser, setIsAuthenticated } = useStore.getState();
  setIsAuthenticated(false);
  clearUser();
  window.location.href = "/sign-in";
};

export { axiosInstance };
