// src/hooks/useAttendanceReports.js
import { useState, useEffect, useCallback, useRef } from 'react';
import attendanceService from '@/apis/services/attendanceService';
import authService from '@/apis/services/authService';

export const useAttendanceReports = () => {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    averageAttendance: 0,
    totalWorkingHours: 0,
    totalPresent: 0,
    totalAbsent: 0
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Add ref to track current request and prevent race conditions
  const currentRequestRef = useRef(null);
  const isInitialMount = useRef(true);

  // Fetch all employees for dropdown
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await authService.getAllEmployees();
      if (response?.data?.employees) {
        setEmployees(response.data.employees);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees');
    }
  }, []);

  // Generate monthly report
  const generateMonthlyReport = useCallback(async (targetMonth, targetYear) => {
    // Use current state if no parameters provided
    const queryMonth = targetMonth !== undefined ? targetMonth : month;
    const queryYear = targetYear !== undefined ? targetYear : year;
    
    const requestId = `monthly_${queryMonth}_${queryYear}_${Date.now()}`;
    currentRequestRef.current = requestId;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.generateAttendanceReport(queryMonth, queryYear);
      
      // Check if this request is still current
      if (currentRequestRef.current !== requestId) {
        console.log('Request cancelled - newer request in progress');
        return;
      }
      
      if (response?.data?.report) {
        const { report } = response.data;
        setReports(report.summary || []);
        
        // Calculate summary from report data
        const totalEmployees = report.summary?.length || 0;
        const totalPresent = report.summary?.reduce((sum, emp) => sum + emp.presentDays, 0) || 0;
        const totalDays = report.summary?.reduce((sum, emp) => sum + emp.totalDays, 0) || 0;
        const totalWorkingHours = report.summary?.reduce((sum, emp) => sum + emp.totalWorkingHours, 0) || 0;
        const averageAttendance = totalDays > 0 ? ((totalPresent / totalDays) * 100).toFixed(2) : 0;

        setSummary({
          totalEmployees,
          averageAttendance: parseFloat(averageAttendance),
          totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
          totalPresent,
          totalAbsent: totalDays - totalPresent,
          totalDays: totalDays / totalEmployees // Average days per employee
        });
      } else {
        // Clear data if no report found
        setReports([]);
        setSummary({
          totalEmployees: 0,
          averageAttendance: 0,
          totalWorkingHours: 0,
          totalPresent: 0,
          totalAbsent: 0
        });
      }
    } catch (err) {
      // Only handle error if this request is still current
      if (currentRequestRef.current === requestId) {
        console.error('Error generating report:', err);
        setError('Failed to generate report');
        setReports([]);
        setSummary({
          totalEmployees: 0,
          averageAttendance: 0,
          totalWorkingHours: 0,
          totalPresent: 0,
          totalAbsent: 0
        });
      }
    } finally {
      // Only set loading false if this request is still current
      if (currentRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []); // Remove dependencies to prevent infinite loops

  // Get attendance history for specific employee or date range
  const getAttendanceHistory = useCallback(async (startDate, endDate, employeeId = null) => {
    const requestId = `history_${startDate}_${endDate}_${employeeId}_${Date.now()}`;
    currentRequestRef.current = requestId;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.getAttendanceHistory(startDate, endDate, employeeId);
      
      // Check if this request is still current
      if (currentRequestRef.current !== requestId) {
        console.log('Request cancelled - newer request in progress');
        return;
      }
      
      if (response?.data?.history) {
        // Transform history data for reports table
        const historyData = response.data.history.flatMap(dayRecord => 
          dayRecord.attendanceRecords.map(record => ({
            id: record._id,
            employeeId: record.employee._id,
            employeeName: record.employee.name,
            employeeEmail: record.employee.email,
            position: record.employee.position,
            department: record.employee.department,
            date: new Date(dayRecord.date).toLocaleDateString(),
            status: record.status,
            checkInTime: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A',
            checkOutTime: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A',
            workingHours: record.workingHours || 0,
            isLate: record.isLate || false,
            lateMinutes: record.lateMinutes || 0,
            notes: record.notes || ''
          }))
        );
        
        setReports(historyData);
        
        // Calculate summary from history data
        const totalRecords = historyData.length;
        const presentRecords = historyData.filter(record => record.status === 'present');
        const totalWorkingHours = presentRecords.reduce((sum, record) => sum + record.workingHours, 0);
        
        setSummary({
          totalEmployees: new Set(historyData.map(r => r.employeeId)).size,
          averageAttendance: totalRecords > 0 ? ((presentRecords.length / totalRecords) * 100).toFixed(2) : 0,
          totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
          totalPresent: presentRecords.length,
          totalAbsent: totalRecords - presentRecords.length,
          totalDays: totalRecords
        });
      } else {
        // Clear data if no history found
        setReports([]);
        setSummary({
          totalEmployees: 0,
          averageAttendance: 0,
          totalWorkingHours: 0,
          totalPresent: 0,
          totalAbsent: 0
        });
      }
    } catch (err) {
      // Only handle error if this request is still current
      if (currentRequestRef.current === requestId) {
        console.error('Error fetching attendance history:', err);
        setError('Failed to fetch attendance history');
        setReports([]);
      }
    } finally {
      // Only set loading false if this request is still current
      if (currentRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  // Get attendance statistics
  const getAttendanceStats = useCallback(async (targetMonth, targetYear) => {
    const queryMonth = targetMonth !== undefined ? targetMonth : month;
    const queryYear = targetYear !== undefined ? targetYear : year;
    
    const requestId = `stats_${queryMonth}_${queryYear}_${Date.now()}`;
    currentRequestRef.current = requestId;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.getAttendanceStats(queryMonth, queryYear);
      
      // Check if this request is still current
      if (currentRequestRef.current !== requestId) {
        console.log('Request cancelled - newer request in progress');
        return;
      }
      
      if (response?.data) {
        const { overall, departmentStats } = response.data;
        
        setSummary({
          totalEmployees: Math.round(overall.totalEmployeeEntries / response.data.period.workingDays),
          averageAttendance: overall.attendancePercentage,
          totalWorkingHours: overall.totalWorkingHours,
          totalPresent: overall.totalPresent,
          totalAbsent: overall.totalAbsent,
          departmentStats: departmentStats
        });
      }
    } catch (err) {
      // Only handle error if this request is still current
      if (currentRequestRef.current === requestId) {
        console.error('Error fetching attendance stats:', err);
        setError('Failed to fetch attendance statistics');
      }
    } finally {
      // Only set loading false if this request is still current
      if (currentRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []); // Remove dependencies to prevent infinite loops

  // Export report data
  const exportReport = useCallback((format = 'csv') => {
    if (!reports.length) {
      alert('No data to export');
      return;
    }

    if (format === 'csv') {
      const headers = [
        'Employee Name',
        'Email',
        'Position',
        'Department',
        'Date',
        'Status',
        'Check In',
        'Check Out',
        'Working Hours',
        'Late Minutes',
        'Notes'
      ];

      const rows = reports.map(record => [
        record.employeeName || record.employee?.name || '',
        record.employeeEmail || record.employee?.email || '',
        record.position || record.employee?.position || '',
        record.department || record.employee?.department || '',
        record.date || '',
        record.status || '',
        record.checkInTime || 'N/A',
        record.checkOutTime || 'N/A',
        record.workingHours || record.totalWorkingHours || 0,
        record.lateMinutes || 0,
        record.notes || ''
      ].map(item => `"${item}"`).join(','));

      const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(',') + "\n"
        + rows.join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `attendance_report_${month + 1}_${year}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [reports, month, year]);

  // Refresh data function
  const refreshData = useCallback(() => {
    if (selectedEmployee) {
      // If an employee is selected, get their history
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      getAttendanceHistory(startDate, endDate, selectedEmployee);
    } else if (dateRange.startDate && dateRange.endDate) {
      // If date range is set, get history for that range
      getAttendanceHistory(dateRange.startDate, dateRange.endDate, null);
    } else {
      // Otherwise get monthly report
      generateMonthlyReport(month, year);
    }
  }, [selectedEmployee, month, year, dateRange, generateMonthlyReport, getAttendanceHistory]);

  // Initialize employees
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Load initial data only once on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      generateMonthlyReport(month, year);
    }
  }, []); // Empty dependency array - only run once

  return {
    // Data
    reports,
    summary,
    employees,
    loading,
    error,
    
    // Filter states
    selectedEmployee,
    setSelectedEmployee,
    month,
    setMonth,
    year,
    setYear,
    dateRange,
    setDateRange,
    
    // Actions
    generateMonthlyReport,
    getAttendanceHistory,
    getAttendanceStats,
    exportReport,
    
    // Utility functions
    refreshData,
    clearError: () => setError(null)
  };
};