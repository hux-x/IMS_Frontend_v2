// src/components/EmployeeAttendanceList.jsx
import React from 'react';

const EmployeeAttendanceList = ({ employees, onStatusChange }) => {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getStatusColor = (status) => {
        if (status === 'Present') return 'text-green-600 bg-green-100';
        if (status === 'Absent') return 'text-red-600 bg-red-100';
        if (status === 'Late') return 'text-yellow-600 bg-yellow-100';
        return 'text-gray-600 bg-gray-100'; // Default for N/A or other statuses
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Employee Attendance - Tuesday, July 29, 2025</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {employees.length === 0 ? (
                    <li className="p-6 text-center text-gray-500">No employees found.</li>
                ) : (
                    employees.map((employee) => (
                        <li key={employee.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                                    {getInitials(employee.name)}
                                </div>
                                <div>
                                    <p className="text-md font-medium text-gray-800">{employee.name}</p>
                                    <p className="text-sm text-gray-500">{employee.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-8 text-sm text-gray-700">
                                <div>
                                    <p className="font-semibold">Check-in</p>
                                    <p>{employee.checkIn || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Check-out</p>
                                    <p>{employee.checkOut || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Status</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                            {employee.status}
                                        </span>
                                        <button
                                            onClick={() => onStatusChange(employee.id, 'Present')}
                                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                                                employee.status === 'Present' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } transition duration-150 ease-in-out`}
                                        >
                                            Present
                                        </button>
                                        <button
                                            onClick={() => onStatusChange(employee.id, 'Absent')}
                                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                                                employee.status === 'Absent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } transition duration-150 ease-in-out`}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default EmployeeAttendanceList;