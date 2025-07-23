import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://e-learning-server-yvsm.onrender.com",
  withCredentials: true, // Required for cookies
  timeout: 10000, // 10s timeout
});

// ✅ Auto-add Content-Type if missing
axiosInstance.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
}, (err) => Promise.reject(err));

// ✅ Better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout - please try again";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;