// src/components/layout/EmployeeAttendanceList.jsx
import React from 'react';

const EmployeeAttendanceList = ({ 
  employees, 
  onStatusChange,
  date,
  processingEmployee
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

  const getButtonClass = (currentStatus, targetStatus, isProcessing) => {
    if (isProcessing) {
      return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    }
    return currentStatus === targetStatus 
      ? 'bg-blue-600 text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Employee Attendance - {date}</h3>
        <p className="text-sm text-gray-500 mt-1">Total Employees: {employees.length}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Employee</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Department</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Check-in</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Check-out</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Working Hours</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No employees found matching your filters.
                </td>
              </tr>
            ) : (
              employees.map((employee) => {
                const isProcessing = processingEmployee === employee.id;
                
                return (
                  <tr 
                    key={employee.id} 
                    className={`hover:bg-gray-50 transition duration-150 ease-in-out ${
                      isProcessing ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(employee.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.position || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {employee.department || 'N/A'}
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-700">
                        {employee.checkIn}
                        {employee.isLate && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            Late {employee.lateMinutes}m
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {employee.checkOut}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {employee.workingHours > 0 ? `${employee.workingHours.toFixed(2)}h` : 'N/A'}
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
                          disabled={isProcessing || employee.status === 'Present'}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition duration-150 ease-in-out ${
                            getButtonClass(employee.status, 'Present', isProcessing)
                          } disabled:cursor-not-allowed relative`}
                          title={employee.status === 'Present' ? 'Already checked in' : 'Check in employee'}
                        >
                          {isProcessing && employee.status !== 'Present' ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing
                            </span>
                          ) : (
                            'Check In'
                          )}
                        </button>
                        <button
                          onClick={() => onStatusChange(employee.id, 'Absent')}
                          disabled={isProcessing || employee.status === 'Absent'}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition duration-150 ease-in-out ${
                            getButtonClass(employee.status, 'Absent', isProcessing)
                          } disabled:cursor-not-allowed`}
                          title={employee.status === 'Absent' ? 'Already checked out' : 'Check out employee'}
                        >
                          {isProcessing && employee.status !== 'Absent' ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing
                            </span>
                          ) : (
                            'Check Out'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {employees.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-4">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-100 rounded-full mr-2"></span>
                Present: {employees.filter(e => e.status === 'Present').length}
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-100 rounded-full mr-2"></span>
                Absent: {employees.filter(e => e.status === 'Absent').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendanceList;