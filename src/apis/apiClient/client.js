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
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjZmMDFmOGYxYWYzYTM2OWZhYjRkYiIsImlhdCI6MTc1NjgxOTQ4NywiZXhwIjoxNzU5MjM4Njg3fQ.QDsbwZca-MqM7dfGci_3azZpePdhw3J3CL6MqQWbfwI"
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;