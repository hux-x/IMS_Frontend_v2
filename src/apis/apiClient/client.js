// src/apis/apiClient/client.js
import axios from "axios";
import { getToken } from "@/apis/localStorage/tokenStorage";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    "Content-Type": "application/json",
  }
});

client.interceptors.request.use(function (config) {
  const token = getToken(); // Dynamically get token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If the data is FormData, remove Content-Type header to let browser set it
  // with proper boundary for multipart/form-data
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Optional: Add response interceptor for better error handling
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific errors if needed
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - token may be expired');
    }
    
    return Promise.reject(error);
  }
);

export default client;