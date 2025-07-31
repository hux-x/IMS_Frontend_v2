// src/components/EmployeeAttendanceTable.jsx
import React from 'react';

const EmployeeAttendanceTable = ({ 
  employees, 
  onStatusChange,
  date = "Tuesday, July 29, 2025" 
}) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status) => {
    if (status === 'Present') return 'text-green-600 bg-green-100';
    if (status === 'Absent') return 'text-red-600 bg-red-100';
    if (status === 'Late') return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getButtonClass = (currentStatus, targetStatus) => {
    return currentStatus === targetStatus 
      ? 'bg-blue-600 text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Employee Attendance - {date}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Employee</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Check-in</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Check-out</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                        {getInitials(employee.name)}
                      </div>
                      <div>
                        <p className="text-md font-medium text-gray-800">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {employee.checkIn || 'N/A'}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {employee.checkOut || 'N/A'}
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onStatusChange(employee.id, 'Present')}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${getButtonClass(employee.status, 'Present')} transition duration-150 ease-in-out`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => onStatusChange(employee.id, 'Absent')}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${getButtonClass(employee.status, 'Absent')} transition duration-150 ease-in-out`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => onStatusChange(employee.id, 'Late')}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${getButtonClass(employee.status, 'Late')} transition duration-150 ease-in-out`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendanceTable;