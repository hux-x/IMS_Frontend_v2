import { useState, useEffect, useCallback } from "react";
import attendanceService from "@/apis/services/attendanceService";


export const useAttendanceData = () => {
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [absentEmployees, setAbsentEmployees] = useState([]);
  const [todaysAttendance, setTodaysAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch today's present employees
  const fetchPresentEmployees = useCallback(async () => {
    try {
      const response = await attendanceService.getPresentEmployees();
      if (response?.data?.presentEmployees) {
        setPresentEmployees(response.data.presentEmployees);
      }
      return response?.data?.presentEmployees || [];
    } catch (err) {
      console.error('Error fetching present employees:', err);
      throw new Error('Failed to fetch present employees');
    }
  }, []);

  // Fetch today's absent employees
  const fetchAbsentEmployees = useCallback(async () => {
    try {
      const response = await attendanceService.getAbsentEmployees();
      if (response?.data?.absentEmployees) {
        setAbsentEmployees(response.data.absentEmployees);
      }
      return response?.data?.absentEmployees || [];
    } catch (err) {
      console.error('Error fetching absent employees:', err);
      throw new Error('Failed to fetch absent employees');
    }
  }, []);

  // Fetch today's complete attendance data
  const fetchTodaysAttendance = useCallback(async () => {
    try {
      const response = await attendanceService.getTodaysAttendance();
      if (response?.data?.attendance) {
        setTodaysAttendance(response.data.attendance);
        console.log(response.data.attendance)
      }
      return response?.data?.attendance || null;
    } catch (err) {
      console.error('Error fetching today\'s attendance:', err);
      throw new Error('Failed to fetch today\'s attendance');
    }
  }, []);

  // Refresh all attendance data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchPresentEmployees(),
        fetchAbsentEmployees(),
        fetchTodaysAttendance()
      ]);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  }, [fetchPresentEmployees, fetchAbsentEmployees, fetchTodaysAttendance]);

  // Get combined employee data with status
  const getAllEmployees = useCallback(() => {
    const combined = [];
    
    // Add present employees
    presentEmployees.forEach(record => {
      combined.push({
        ...record,
        status: 'Present',
        employee: record.employee || {}
      });
    });
    
    // Add absent employees
    absentEmployees.forEach(record => {
      combined.push({
        ...record,
        status: 'Absent',
        employee: record.employee || {}
      });
    });
    
    return combined;
  }, [presentEmployees, absentEmployees]);

  // Get attendance summary
  const getAttendanceSummary = useCallback(() => {
    const total = presentEmployees.length + absentEmployees.length;
    const present = presentEmployees.length;
    const absent = absentEmployees.length;
    const presentPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    const totalWorkingHours = presentEmployees.reduce((sum, record) => {
      return sum + (record.workingHours || 0);
    }, 0);

    const lateEmployees = presentEmployees.filter(record => record.isLate).length;

    return {
      total,
      present,
      absent,
      presentPercentage: parseFloat(presentPercentage),
      totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
      averageWorkingHours: present > 0 ? parseFloat((totalWorkingHours / present).toFixed(2)) : 0,
      lateEmployees
    };
  }, [presentEmployees, absentEmployees]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auto-refresh every 5 minutes during work hours
  useEffect(() => {
    const isWorkingHours = () => {
      const now = new Date();
      const hour = now.getHours();
      // Assuming work hours are 7 AM to 7 PM
      return hour >= 7 && hour <= 19;
    };

    let intervalId;
    
    if (isWorkingHours()) {
      intervalId = setInterval(() => {
        refreshData();
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refreshData]);

  return {
    // Raw data
    presentEmployees,
    absentEmployees,
    todaysAttendance,
    
    // Combined data
    allEmployees: getAllEmployees(),
    
    // Summary
    summary: getAttendanceSummary(),
    
    // States
    loading,
    error,
    
    // Actions
    refreshData,
    fetchPresentEmployees,
    fetchAbsentEmployees,
    fetchTodaysAttendance,
    
    // Utilities
    clearError: () => setError(null),
    isDataStale: () => {
      // Check if data is older than 10 minutes
      const lastFetch = localStorage.getItem('lastAttendanceFetch');
      if (!lastFetch) return true;
      
      const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
      return parseInt(lastFetch) < tenMinutesAgo;
    }
  };
};