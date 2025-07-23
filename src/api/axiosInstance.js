import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://e-learning-server-ss29.onrender.com",
  withCredentials: true,
  timeout: 15000, // Increased timeout for Render.com
});

// ➡️ Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure headers exist
    config.headers = config.headers || {};
    
    // Default headers
    config.headers["Content-Type"] = "application/json";
    config.headers["X-Requested-With"] = "XMLHttpRequest"; // Critical for CORS

    // Add auth token if available
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.debug("⬆️ Sending request to:", config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request setup failed:", error);
    return Promise.reject(error);
  }
);

// ⬅️ Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.debug("⬇️ Received response from:", response.config.url);
    return response;
  },
  (error) => {
    // Enhanced error diagnostics
    const errorInfo = {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method
      },
      response: error.response?.data
    };

    // Special handling for CORS errors
    if (error.message.includes("cross-origin") || error.message.includes("CORS")) {
      errorInfo.corsAdvice = "Check if: 1) Backend URL matches exactly 2) All headers are allowed 3) Credentials are properly set";
    }

    console.error("❌ API Error:", errorInfo);

    // Auto-logout on 401
    if (error.response?.status === 401) {
      sessionStorage.removeItem("accessToken");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;