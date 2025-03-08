import axios from "axios";

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
  // This is crucial for cookies to be sent with requests
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // With httpOnly cookies, we don't need to manually add
    // the token to headers as the browser will automatically
    // send cookies with the request when withCredentials is true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const response = await axiosInstance.post(
//           "/refresh",
//           {},
//           { withCredentials: true }
//         );
//         const { accessToken } = response.data;

//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${accessToken}`;
//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Handle refresh token error (e.g., redirect to login)
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// Response interceptor
// apiClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     const status = error.response?.status;

//     // Handle specific status codes
//     if (status === 401) {
//       // Add logic for token refresh here
//     }

//     return Promise.reject({ message, status });
//   }
// );
