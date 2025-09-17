// src/hooks/useAttendanceReports.js
import { useState, useEffect, useCallback } from 'react';
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
  const generateMonthlyReport = useCallback(async (targetMonth = month, targetYear = year) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.generateAttendanceReport(targetMonth, targetYear);
      
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
      }
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Get attendance history for specific employee or date range
  const getAttendanceHistory = useCallback(async (startDate, endDate, employeeId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.getAttendanceHistory(startDate, endDate, employeeId);
      
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
      }
    } catch (err) {
      console.error('Error fetching attendance history:', err);
      setError('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get attendance statistics
  const getAttendanceStats = useCallback(async (targetMonth = month, targetYear = year) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.getAttendanceStats(targetMonth, targetYear);
      
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
      console.error('Error fetching attendance stats:', err);
      setError('Failed to fetch attendance statistics');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

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

  // Initialize data
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Generate report when month/year changes
  useEffect(() => {
    generateMonthlyReport();
  }, [generateMonthlyReport]);

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
    refreshData: () => generateMonthlyReport(month, year),
    clearError: () => setError(null)
  };
};