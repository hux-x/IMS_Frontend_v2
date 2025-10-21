// src/apis/endpoints/attendance.js
import client from "@/apis/apiClient/client";

export const initiateAttendance = async () => {
  return await client.post("/attendance/initiate");
};

export const employeeCheckIn = async (latitude = null, longitude = null) => {
  const body = {};
  if (latitude !== null && longitude !== null) {
    body.latitude = latitude;
    body.longitude = longitude;
  }
  return await client.post("/attendance/checkin", body);
};

export const employeeCheckOut = async (latitude = null, longitude = null) => {
  const body = {};
  if (latitude !== null && longitude !== null) {
    body.latitude = latitude;
    body.longitude = longitude;
  }
  return await client.post("/attendance/checkout", body);
};

export const getPresentEmployees = async () => {
  return await client.get("/attendance/present");
};

export const getAbsentEmployees = async () => {
  return await client.get("/attendance/absent");
};

export const getTodaysAttendance = async () => {
  return await client.get("/attendance/today");
};

export const getEmployeeAttendanceStatus = async () => {
  return await client.get("/attendance/status");
};

export const generateAttendanceReport = async (month = null, year = null) => {
  const params = new URLSearchParams();
  if (month !== null) params.append('month', month);
  if (year !== null) params.append('year', year);
  
  const queryString = params.toString();
  const url = queryString ? `/attendance/report?${queryString}` : "/attendance/report";
  
  return await client.get(url);
};

export const getAttendanceHistory = async (startDate = null, endDate = null, employeeId = null) => {
  const params = new URLSearchParams();
  if (startDate !== null) params.append('startDate', startDate);
  if (endDate !== null) params.append('endDate', endDate);
  if (employeeId !== null) params.append('employeeId', employeeId);
  
  const queryString = params.toString();
  const url = queryString ? `/attendance/history?${queryString}` : "/attendance/history";
  
  return await client.get(url);
};

export const updateAttendanceRecord = async (attendanceId, recordId, status = null, notes = null) => {
  const body = {};
  if (status !== null) body.status = status;
  if (notes !== null) body.notes = notes;
  
  return await client.put(`/attendance/${attendanceId}/record/${recordId}`, body);
};

export const deleteAttendanceRecord = async (attendanceId) => {
  return await client.delete(`/attendance/${attendanceId}`);
};

export const adminCheckinemployee = async(employeeId)=>{
  return await client.post(`/attendance/admin-checkin?employeeId=${employeeId}`);
}
export const adminCheckOutemployee = async(employeeId)=>{
  return await client.post(`/attendance/admin-checkout?employeeId=${employeeId}`);
} 

