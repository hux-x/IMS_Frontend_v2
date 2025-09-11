// src/apis/services/authService.js
import {
  registerEmployee,
  login,
  updateEmployeeInfo,
  getEmployees,
  getFilteredEmployees,
  resetPassword,
  forgotPassword,
  deleteEmployee,
  getAllEmployees,
} from "@/apis/endpoints/auth";
import { storeToken } from "@/apis/localStorage/tokenStorage";
import { storeuserId } from "@/apis/localStorage/idStorage";

const authService = {
  registerEmployee: async (name, username, age, role, position, password) => {
    const response = await registerEmployee(
      name,
      username,
      age,
      role,
      position,
      password
    );
    if (response?.data?.token && response?.data?.userId) {
      storeToken(response.data.token);
      storeuserId(response.data.userId);
    }
    return response;
  },
  login: async (username, password) => {
    const response = await login(username, password);
    if (response?.data?.token && response?.data?.userId) {
      storeToken(response.data.token);
      storeuserId(response.data.userId);
    }
    return response;
  },
  updateEmployeeInfo: async (id, name, username, age, role, position) => {
    return await updateEmployeeInfo(id, name, username, age, role, position);
  },
  getEmployees: async (limit, offset) => {
    return await getEmployees(limit, offset);
  },
  getFilteredEmployees: async (
    limit,
    offset,
    role,
    position,
    status,
    available
  ) => {
    return await getFilteredEmployees(
      limit,
      offset,
      role,
      position,
      status,
      available
    );
  },
  resetPassword: async (password, candidatePassword) => {
    return await resetPassword(password, candidatePassword);
  },
  forgotPassword: async (username, newPassword) => {
    return await forgotPassword(username, newPassword);
  },
  deleteEmployee: async (id) => {
    return await deleteEmployee(id);
  },
  getAllEmployees: async () => {
    return await getAllEmployees();
  }
};
export default authService;