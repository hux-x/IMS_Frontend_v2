// src/apis/services/authService.js
import {
  registerEmployee,
  login,
  updateEmployeeInfo,
  getEmployees as getEmployeesx,
  getFilteredEmployees,
  resetPassword,
  forgotPassword,
  deleteEmployee,
  getAllEmployees,
  getUserInfo,
  tokenPasswordReset,
  changeOrAddProfilePicture,
 
} from "@/apis/endpoints/auth";
import { storeToken } from "@/apis/localStorage/tokenStorage";
import { storeuserId } from "@/apis/localStorage/idStorage";

const authService = {
  registerEmployee: async ({name, username, age, role, position, password,email,department,status,startTime,endTime, emergencyContact,address,contact,CNIC}) => {
  
    const response = await registerEmployee(
      name,
      username,
      age,
      role,
      position,
      password,email,department,status,startTime,endTime, emergencyContact,address,contact, CNIC
    );
    return response;
  },
  login: async (username, password) => {
    const response = await login(username, password);
    if (response?.data?.token && response?.data?.userId) {
      console.log(response.data.token)
      storeToken(response.data.token);
      storeuserId(response.data.userId);
    }
    return response;
  },
  updateEmployeeInfo: async (id,updates) => {
    return await updateEmployeeInfo(id, updates);
  },
  getEmployees: async (limit, offset) => {
    return await getEmployeesx(limit, offset);
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
  forgotPassword: async (email) => {
    return await forgotPassword(email);
  },
  deleteEmployee: async (id) => {
    return await deleteEmployee(id);
  },
  getAllEmployees: async () => {
    return await getAllEmployees();
  },
  getUserInfo: async ()=>{
    return await getUserInfo();
  },
  resetPasswordForToken: async (password, token) => {
    return await tokenPasswordReset(password, token);
  },
  
  
};
export default authService;