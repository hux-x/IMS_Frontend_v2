import client from "@/apis/apiClient/client";

export const getTodaysAttendance = async () => {
  return await client.get("/attendance/todaysAttendance");
};

export const initiateAttendance = async () => {
  return await client.post("/attendance/initiate");
};

export const employeeCheckIn = async () => {
  return await client.post("/attendance/checkin");
};

export const getPresentEmployees = async () => {
  return await client.get("/attendance/present");
};

export const getAbsentEmployees = async () => {
  return await client.get("/attendance/absent");
};

export const generateAndGetAttendanceReport = async () => {
  return await client.get("/attendance/report");
};
