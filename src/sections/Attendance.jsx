// src/components/AttendanceSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/attendence_header';
import AttendanceControls from '@/components/cards/AttendanceControls';
import EmployeeAttendanceList from '@/components/layout/EmployeeAttendanceList';

const initialEmployees = [
    { id: 1, name: 'John Admin', email: 'admin@company.com', checkIn: 'N/A', checkOut: 'N/A', status: 'Absent' },
    { id: 2, name: 'Alice Johnson', email: 'alice@company.com', checkIn: 'N/A', checkOut: 'N/A', status: 'Absent' },
    { id: 3, name: 'Bob Smith', email: 'bob@company.com', checkIn: 'N/A', checkOut: 'N/A', status: 'Absent' },
    { id: 4, name: 'Charlie Brown', email: 'charlie@company.com', checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'Present' },
    { id: 5, name: 'Diana Prince', email: 'diana@company.com', checkIn: '09:15 AM', checkOut: 'N/A', status: 'Present' },
    { id: 6, name: 'Eve Adams', email: 'eve@company.com', checkIn: 'N/A', checkOut: 'N/A', status: 'Absent' },
    { id: 7, name: 'Frank White', email: 'frank@company.com', checkIn: '08:50 AM', checkOut: '04:30 PM', status: 'Present' },
];

const Attendance = () => {
    const [employees, setEmployees] = useState(initialEmployees);
    const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Function to get current date formatted as "Weekday, Month Day, Year"
    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Memoize the filtering logic to avoid unnecessary re-runs
    const applyFilters = useCallback(() => {
        let newFilteredEmployees = [...employees]; // Start with the current state of employees

        // Apply search filter
        if (searchTerm) {
            newFilteredEmployees = newFilteredEmployees.filter(employee =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'All Status') {
            newFilteredEmployees = newFilteredEmployees.filter(employee =>
                employee.status === statusFilter
            );
        }

        setFilteredEmployees(newFilteredEmployees);
    }, [employees, searchTerm, statusFilter]); // Dependencies for useCallback

    useEffect(() => {
        applyFilters();
    }, [applyFilters]); // Re-run effect when applyFilters changes

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
    };

    const handleStatusChange = (employeeId, newStatus) => {
        setEmployees(prevEmployees =>
            prevEmployees.map(employee =>
                employee.id === employeeId ? { ...employee, status: newStatus } : employee
            )
        );
    };

    const handleExport = () => {
        // Basic example of CSV export
        const headers = ["ID", "Name", "Email", "Check-in", "Check-out", "Status"];
        const rows = filteredEmployees.map(emp => [
            emp.id,
            emp.name,
            emp.email,
            emp.checkIn,
            emp.checkOut,
            emp.status
        ].map(item => `"${item}"`).join(',')); // Enclose items in quotes to handle commas within data

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(',') + "\n"
            + rows.join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employee_attendance.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link); // Clean up
        alert('Attendance data exported to CSV!');
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* The header you have in your main layout should probably manage the "CompanyMS" part */}
            <Header
                title="Attendance"
                subtitle="Manage employee attendance"
                date={getCurrentDate()}
                onExport={handleExport} // Pass the export handler
            />
            <main className="flex-1 p-6 overflow-y-auto bg-gray-100"> {/* Added bg-gray-100 for main content background */}
                <AttendanceControls onSearch={handleSearch} onFilterChange={handleFilterChange} />
                <EmployeeAttendanceList employees={filteredEmployees} onStatusChange={handleStatusChange} />
            </main>
        </div>
    );
};

export default Attendance;