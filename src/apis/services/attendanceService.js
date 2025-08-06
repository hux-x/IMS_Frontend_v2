import {
  getTodaysAttendance,
  initiateAttendance,
  employeeCheckIn,
  getPresentEmployees,
  getAbsentEmployees,
  generateAndGetAttendanceReport
} from "@/apis/endpoints/attendance";

export default attendanceService = {
  getTodaysAttendance: async () => {
    return await getTodaysAttendance();
  },
  initiateAttendance: async () => {
    return await initiateAttendance();
  },
  employeeCheckIn: async () => {
    return await employeeCheckIn();
  },
  getPresentEmployees: async () => {
    return await getPresentEmployees();
  },
  getAbsentEmployees: async () => {
    return await getAbsentEmployees();
  },
  generateAndGetAttendanceReport: async () => {
    return await generateAndGetAttendanceReport();
  },
};
