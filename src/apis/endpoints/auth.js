// src/apis/endpoints/auth.js
import client from "@/apis/apiClient/client";

export const registerEmployee = async (name, username, age, role, position, password) => {
  return await client.post("/employees/register", { name, username, age, role, position, password });
};

export const login = async (username, password) => {
  return await client.post("/employees/login", { username, password });
};

export const updateEmployeeInfo = async (id, name = null, username = null, age = null, role = null, position = null) => {
  const body = {};
  if (name !== null) body.name = name;
  if (username !== null) body.username = username;
  if (age !== null) body.age = age;
  if (role !== null) body.role = role;
  if (position !== null) body.position = position;
  return await client.put(`/employees/update/${id}`, body); // Fixed URL to match backend route
};

export const getEmployees = async (limit, offset) => {
  return await client.get(`/employees/all?limit=${limit}&offset=${offset}`); // Adjusted to use /all
};

export const getFilteredEmployees = async (limit, offset, role = null, position = null, status = null, available = null) => {
  const query = new URLSearchParams({
    limit,
    offset,
    ...(role && { role }),
    ...(position && { position }),
    ...(status && { status }),
    ...(available && { available }),
  }).toString();
  return await client.get(`/employees/filtered?${query}`); // Fixed to match backend
};

export const getAllEmployees = async () => {
  return await client.get("/employees/all");
};

export const resetPassword = async (password, candidatePassword) => {
  return await client.post("/employees/reset-password", { password, candidatePassword });
};

export const forgotPassword = async (username, newPassword) => {
  return await client.post("/employees/forgot-password", { username, newPassword });
};

export const deleteEmployee = async (id) => {
  return await client.delete(`/employees/delete/${id}`); // Fixed URL to match backend
};