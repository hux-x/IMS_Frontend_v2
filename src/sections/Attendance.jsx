// src/components/AttendanceSection.jsx
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/attendence_header';
import AttendanceControls from '@/components/cards/AttendanceControls';
import EmployeeAttendanceList from '@/components/layout/EmployeeAttendanceList';
import { useAttendanceData } from '@/hooks/useAttendance';
import attendanceService from '@/apis/services/attendanceService';

const AttendanceSection = () => {
    const {
        presentEmployees,
        absentEmployees,
        allEmployees,
        todaysAttendance,
        loading,
        error,
        refreshData
    } = useAttendanceData();

    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [processingEmployee, setProcessingEmployee] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Function to get current date formatted as "Weekday, Month Day, Year"
    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Combine present and absent employees for display
    const combineEmployeeData = useCallback(() => {
        const combined = [];
        
        // Add present employees
        if (presentEmployees?.length) {
            presentEmployees.forEach(record => {
                combined.push({
                    id: record.employee._id,
                    name: record.employee.name,
                    email: record.employee.email,
                    position: record.employee.position,
                    department: record.employee.department,
                    checkIn: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A',
                    checkOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A',
                    status: 'Present',
                    workingHours: record.workingHours || 0,
                    isLate: record.isLate || false,
                    lateMinutes: record.lateMinutes || 0,
                    coordinates: {
                        checkIn: record.checkInCoordinates,
                        checkOut: record.checkOutCoordinates
                    }
                });
            });
        }
        
        // Add absent employees
        if (absentEmployees?.length) {
            absentEmployees.forEach(record => {
                combined.push({
                    id: record.employee._id,
                    name: record.employee.name,
                    email: record.employee.email,
                    position: record.employee.position,
                    department: record.employee.department,
                    checkIn: 'N/A',
                    checkOut: 'N/A',
                    status: 'Absent',
                    workingHours: 0,
                    isLate: false,
                    lateMinutes: 0,
                    coordinates: null
                });
            });
        }
        
        return combined;
    }, [presentEmployees, absentEmployees]);

    // Memoize the filtering logic
    const applyFilters = useCallback(() => {
        let employees = combineEmployeeData();

        // Apply search filter
        if (searchTerm) {
            employees = employees.filter(employee =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'All Status') {
            employees = employees.filter(employee =>
                employee.status === statusFilter
            );
        }

        setFilteredEmployees(employees);
    }, [combineEmployeeData, searchTerm, statusFilter]);

    // Apply filters when data changes
    React.useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
    };

    const handleStatusChange = async (employeeId, newStatus) => {
        // Find employee name for better feedback
        const employee = filteredEmployees.find(emp => emp.id === employeeId);
        const employeeName = employee?.name || 'Employee';

        // Prevent duplicate actions
        if (processingEmployee === employeeId) {
            showNotification('Action already in progress', 'warning');
            return;
        }

        setProcessingEmployee(employeeId);

        try {
            if (newStatus === 'Present') {
                const res = await attendanceService.adminCheckinemployee(employeeId);
                
                if (res.status === 200 || res.status === 201) {
                    showNotification(`${employeeName} checked in successfully`, 'success');
                    await refreshData();
                } else {
                    showNotification(`Failed to check-in ${employeeName}`, 'error');
                }
            } else if (newStatus === 'Absent') {
                const res = await attendanceService.adminCheckOutemployee(employeeId);
                
                if (res.status === 200 || res.status === 201) {
                    showNotification(`${employeeName} checked out successfully`, 'success');
                    await refreshData();
                } else {
                    showNotification(`Failed to check-out ${employeeName}`, 'error');
                }
            } else if (newStatus === 'Late') {
                // If you want to handle "Late" status separately
                showNotification('Late status is automatically tracked on check-in', 'info');
            }
        } catch (error) {
            console.error('Error updating employee status:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            showNotification(`Error: ${errorMessage}`, 'error');
        } finally {
            setProcessingEmployee(null);
        }
    };

    const handleExport = () => {
        if (!filteredEmployees.length) {
            showNotification('No data to export', 'warning');
            return;
        }

        try {
            const headers = [
                "ID", "Name", "Email", "Position", "Department", 
                "Check-in", "Check-out", "Status", "Working Hours", "Late Minutes"
            ];
            
            const rows = filteredEmployees.map(emp => [
                emp.id,
                emp.name,
                emp.email,
                emp.position || '',
                emp.department || '',
                emp.checkIn,
                emp.checkOut,
                emp.status,
                emp.workingHours,
                emp.lateMinutes
            ].map(item => `"${item}"`).join(','));

            const csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(',') + "\n"
                + rows.join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `attendance_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Attendance data exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            showNotification('Failed to export data', 'error');
        }
    };

    if (error) {
        return (
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header
                    title="Attendance"
                    subtitle="Manage employee attendance"
                    date={getCurrentDate()}
                    onExport={handleExport}
                />
                <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error Loading Attendance Data
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={refreshData}
                                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Notification Toast */}
            {notification.show && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`rounded-lg shadow-lg p-4 min-w-[300px] ${
                        notification.type === 'success' ? 'bg-green-50 border border-green-200' :
                        notification.type === 'error' ? 'bg-red-50 border border-red-200' :
                        notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-blue-50 border border-blue-200'
                    }`}>
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 ${
                                notification.type === 'success' ? 'text-green-600' :
                                notification.type === 'error' ? 'text-red-600' :
                                notification.type === 'warning' ? 'text-yellow-600' :
                                'text-blue-600'
                            }`}>
                                {notification.type === 'success' && (
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                )}
                                {notification.type === 'error' && (
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                )}
                                {notification.type === 'warning' && (
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                    notification.type === 'success' ? 'text-green-800' :
                                    notification.type === 'error' ? 'text-red-800' :
                                    notification.type === 'warning' ? 'text-yellow-800' :
                                    'text-blue-800'
                                }`}>
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Header
                title="Attendance"
                subtitle="Manage employee attendance"
                date={getCurrentDate()}
                onExport={handleExport}
                stats={{
                    total: filteredEmployees.length,
                    present: filteredEmployees.filter(emp => emp.status === 'Present').length,
                    absent: filteredEmployees.filter(emp => emp.status === 'Absent').length
                }}
            />
            <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading attendance data...</span>
                    </div>
                ) : (
                    <>
                        <AttendanceControls 
                            onSearch={handleSearch} 
                            onFilterChange={handleFilterChange}
                            onRefresh={refreshData}
                        />
                        <EmployeeAttendanceList 
                            date={getCurrentDate()}
                            employees={filteredEmployees} 
                            onStatusChange={handleStatusChange}
                            processingEmployee={processingEmployee}
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default AttendanceSection;