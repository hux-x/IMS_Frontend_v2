import axios from "axios";
import { getToken } from "@/apis/localStorage/tokenStorage";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  }
});
client.interceptors.request.use(function (config) {
    const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Nzk2ZjBmYzRmOTYxNGNlN2RmNWU3YiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NTA5NzY0NiwiZXhwIjoxNzU1MTAxMjQ2fQ.VWHmkdBo41e9WqGnBYIo-LnhzOP4GkS_lmLUtbzU884"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;