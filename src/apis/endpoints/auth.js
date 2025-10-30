// src/apis/endpoints/auth.js
import client from "@/apis/apiClient/client";

export const registerEmployee = async (name, username, age, role, position, password, email, department, status, startTime, endTime, emergencyContact, address, contact, CNIC) => {
  return await client.post("/employees/register", { 
    name, 
    username, 
    age, 
    role, 
    position, 
    password, 
    email, 
    department, 
    status, 
    startTime, 
    endTime, 
    emergencyContact, 
    address, 
    contact,
    CNIC 
  });
};

export const login = async (username, password) => {
  return await client.post("/employees/login", { username, password });
};

// Updated updateEmployeeInfo function with all necessary fields
export const updateEmployeeInfo = async (
  id, 
  {
    name = null,
    username = null,
    email = null,
    age = null,
    role = null,
    position = null,
    department = null,
    status = null,
    password = null,
    contact = null,
    team = null,
    available = null,
    isOnline = null,
    startTime = null,
    endTime = null,
    CNIC = null,
    emergencyContact = null,
    address = null
  } = {}
) => {
  const body = {};
  
  // Only include fields that are not null/undefined
  if (name !== null && name !== undefined) body.name = name;
  if (emergencyContact !== null && emergencyContact !== undefined) body.emergencyContact = emergencyContact;
  if (address !== null && address !== undefined) body.address = address;
  if (username !== null && username !== undefined) body.username = username;
  if (email !== null && email !== undefined) body.email = email;
  if (age !== null && age !== undefined) body.age = age;
  if (role !== null && role !== undefined) body.role = role;
  if (position !== null && position !== undefined) body.position = position;
  if (department !== null && department !== undefined) body.department = department;
  if (status !== null && status !== undefined) body.status = status;
  if (password !== null && password !== undefined && password.trim() !== '') {
    body.password = password.trim();
  }
  if (contact !== null && contact !== undefined) body.contact = contact;
  if (team !== null && team !== undefined) body.team = team;
  if (available !== null && available !== undefined) body.available = available;
  if (isOnline !== null && isOnline !== undefined) body.isOnline = isOnline;
  if (CNIC !== null && CNIC !== undefined) body.CNIC = CNIC;
  
  // Handle work_shift - send both times together if either is provided
  if (startTime !== null && startTime !== undefined || endTime !== null && endTime !== undefined) {
    body.work_shift = {
      startTime: startTime !== null && startTime !== undefined ? startTime : undefined,
      endTime: endTime !== null && endTime !== undefined ? endTime : undefined
    };
  }
  
  console.log(body, " sending data to the backend");

  return await client.put(`/employees/update/${id}`, body);
};

export const getEmployees = async (limit, offset) => {
  return await client.get(`/employees/all?limit=${limit}&offset=${offset}`);
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
  return await client.get(`/employees/filtered?${query}`);
};

export const getAllEmployees = async () => {
  return await client.get("/employees/all");
};

export const resetPassword = async (password, candidatePassword) => {
  return await client.post("/employees/reset-password", { password, candidatePassword });
};

export const forgotPassword = async (email) => {
  return await client.post("/employees/forgot-password", { email });
};

export const deleteEmployee = async (id) => {
  return await client.delete(`/employees/delete/${id}`);
};

export const getUserInfo = async ()=>{
  return await client.get("/employees/me");
};
