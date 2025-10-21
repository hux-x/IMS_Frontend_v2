// src/apis/services/attendanceService.js
import {
  initiateAttendance,
  employeeCheckIn,
  employeeCheckOut,
  getPresentEmployees,
  getAbsentEmployees,
  getTodaysAttendance,
  getEmployeeAttendanceStatus,
  generateAttendanceReport,
  getAttendanceHistory,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  adminCheckOutemployee,
  adminCheckinemployee,
} from "@/apis/endpoints/attendance";

const attendanceService = {
  // Admin functions
  initiateAttendance: async () => {
    try {
      const response = await initiateAttendance();
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPresentEmployees: async () => {
    try {
      const response = await getPresentEmployees();
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAbsentEmployees: async () => {
    try {
      const response = await getAbsentEmployees();
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTodaysAttendance: async () => {
    try {
      const response = await getTodaysAttendance();
      return response;
    } catch (error) {
      throw error;
    }
  },

  generateAttendanceReport: async (month = null, year = null) => {
    try {
      const response = await generateAttendanceReport(month, year);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceHistory: async (startDate = null, endDate = null, employeeId = null) => {
    try {
      const response = await getAttendanceHistory(startDate, endDate, employeeId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateAttendanceRecord: async (attendanceId, recordId, status = null, notes = null) => {
    try {
      const response = await updateAttendanceRecord(attendanceId, recordId, status, notes);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteAttendanceRecord: async (attendanceId) => {
    try {
      const response = await deleteAttendanceRecord(attendanceId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Employee functions
  checkIn: async (coordinates = null) => {
    try {
      let latitude = null, longitude = null;
      
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }
      
      const response = await employeeCheckIn(latitude, longitude);
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkInWithLocation: async () => {
    try {
      // Get user's current location
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;
      const response = await employeeCheckIn(latitude, longitude);
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkOut: async (coordinates = null) => {
    try {
      let latitude = null, longitude = null;
      
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }
      
      const response = await employeeCheckOut(latitude, longitude);
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkOutWithLocation: async () => {
    try {
      // Get user's current location
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;
      const response = await employeeCheckOut(latitude, longitude);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyAttendanceStatus: async () => {
    try {
      const response = await getEmployeeAttendanceStatus();
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Utility functions
  getCurrentLocation: async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
    } catch (error) {
      throw error;
    }
  },
   adminCheckOutemployee : async(employeeId)=>{
    try {
      const response = await adminCheckOutemployee(employeeId);
      return response;
    } catch (error) {
      throw error;
    }
  },
  adminCheckinemployee : async(employeeId)=>{
    try {
      const response = await adminCheckinemployee(employeeId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  formatWorkingHours: (hours) => {
    if (!hours || hours === 0) return '0h 0m';
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  },

  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Distance in meters
    return Math.round(distance);
  }
};
// Additional endpoints to add to attendance.js

export const getAttendanceStats = async (month = null, year = null) => {
  const params = new URLSearchParams();
  if (month !== null) params.append('month', month);
  if (year !== null) params.append('year', year);
  
  const queryString = params.toString();
  const url = queryString ? `/attendance/stats?${queryString}` : "/attendance/stats";
  
  return await client.get(url);
};

export const bulkUpdateAttendance = async (updates) => {
  return await client.put("/attendance/bulk-update", { updates });
};

export const getEmployeeAttendanceReport = async (employeeId, startDate = null, endDate = null) => {
  const params = new URLSearchParams();
  params.append('employeeId', employeeId);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  return await client.get(`/attendance/employee-report?${params.toString()}`);
};

export const markManualAttendance = async (employeeId, date, status, notes = null) => {
  const body = { employeeId, date, status };
  if (notes) body.notes = notes;
  
  return await client.post("/attendance/manual-mark", body);
};

// Additional service methods to add to attendanceService.js

const additionalAttendanceService = {
  getAttendanceStats: async (month = null, year = null) => {
    try {
      const response = await getAttendanceStats(month, year);
      return response;
    } catch (error) {
      throw error;
    }
  },

  bulkUpdateAttendance: async (updates) => {
    try {
      const response = await bulkUpdateAttendance(updates);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getEmployeeReport: async (employeeId, startDate = null, endDate = null) => {
    try {
      const response = await getEmployeeAttendanceReport(employeeId, startDate, endDate);
      return response;
    } catch (error) {
      throw error;
    }
  },

  markManualAttendance: async (employeeId, date, status, notes = null) => {
    try {
      const response = await markManualAttendance(employeeId, date, status, notes);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Utility function to check if employee is within office radius
  validateLocation: async (latitude, longitude, officeLatitude, officeLongitude, allowedRadius = 500) => {
    try {
      const distance = calculateDistance(latitude, longitude, officeLatitude, officeLongitude);
      return {
        isValid: distance <= allowedRadius,
        distance,
        allowedRadius
      };
    } catch (error) {
      throw new Error('Failed to validate location');
    }
  },

  // Get working hours summary for a period
  getWorkingHoursSummary: async (employeeId = null, startDate = null, endDate = null) => {
    try {
      const response = await getAttendanceHistory(startDate, endDate, employeeId);
      
      if (response?.data?.history) {
        const records = response.data.history.flatMap(day => 
          day.attendanceRecords.filter(record => record.status === 'present')
        );
        
        const totalHours = records.reduce((sum, record) => sum + (record.workingHours || 0), 0);
        const avgHours = records.length > 0 ? totalHours / records.length : 0;
        const expectedHours = records.length * 8; // Assuming 8 hours per day
        const efficiency = expectedHours > 0 ? (totalHours / expectedHours) * 100 : 0;

        return {
          totalDays: records.length,
          totalHours: Math.round(totalHours * 100) / 100,
          averageHours: Math.round(avgHours * 100) / 100,
          expectedHours,
          efficiency: Math.round(efficiency * 100) / 100,
          records
        };
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  },
 
};

export { additionalAttendanceService };
export default attendanceService;