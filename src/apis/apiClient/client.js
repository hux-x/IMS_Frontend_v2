// src/apis/apiClient/client.js
import axios from "axios";
import { getToken } from "@/apis/localStorage/tokenStorage";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 20000, 
  headers: {
    "Content-Type": "application/json",
  }
});
client.interceptors.request.use(function (config) {
  const token = getToken(); // Dynamically get token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;