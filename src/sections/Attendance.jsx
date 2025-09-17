// src/components/AttendanceSection.jsx
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/attendence_header';
import AttendanceControls from '@/components/cards/AttendanceControls';
import EmployeeAttendanceList from '@/components/layout/EmployeeAttendanceList';
import { useAttendanceData } from '@/hooks/useAttendance';

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

    // Function to get current date formatted as "Weekday, Month Day, Year"
    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
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

    const handleStatusChange = (employeeId, newStatus) => {
        // This would typically call an API to update the status
        // For now, we'll refresh the data to get the latest state
        console.log(`Updating employee ${employeeId} status to ${newStatus}`);
        refreshData();
    };

    const handleExport = () => {
        if (!filteredEmployees.length) {
            alert('No data to export');
            return;
        }

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
        alert('Attendance data exported successfully!');
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
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default AttendanceSection;