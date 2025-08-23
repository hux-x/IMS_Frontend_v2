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
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTNhNTVmZWYzM2I3MDk5NWE1MDkwMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NTc5MjkxMywiZXhwIjoxNzU4MjEyMTEzfQ.HQgSBkwX0OplfsHeGmLxc9ilr16fB8foleAxtg9AkDo"
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;