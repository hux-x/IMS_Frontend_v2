// src/components/layout/ReportsTable.jsx
import React, { useState } from 'react';

const ReportsTable = ({ data = [], loading = false, selectedEmployee, employees = [], onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested employee data
      if (sortConfig.key.includes('employee.')) {
        const key = sortConfig.key.split('.')[1];
        aValue = a.employee?.[key] || '';
        bValue = b.employee?.[key] || '';
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const formatWorkingHours = (hours) => {
    if (!hours || hours === 0) return '0h 0m';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status.toLowerCase()) {
      case 'present':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'absent':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'late':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'half-day':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Determine table columns based on data type
  const isIndividualReport = selectedEmployee || (data.length > 0 && data[0].date);
  
  const columns = isIndividualReport ? [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'checkInTime', label: 'Check In', sortable: true },
    { key: 'checkOutTime', label: 'Check Out', sortable: true },
    { key: 'workingHours', label: 'Working Hours', sortable: true },
    { key: 'lateMinutes', label: 'Late (min)', sortable: true },
    { key: 'notes', label: 'Notes', sortable: false }
  ] : [
    { key: 'employee.name', label: 'Employee', sortable: true },
    { key: 'employee.email', label: 'Email', sortable: true },
    { key: 'employee.position', label: 'Position', sortable: true },
    { key: 'employee.department', label: 'Department', sortable: true },
    { key: 'totalDays', label: 'Total Days', sortable: true },
    { key: 'presentDays', label: 'Present', sortable: true },
    { key: 'attendancePercentage', label: 'Attendance %', sortable: true },
    { key: 'totalWorkingHours', label: 'Working Hours', sortable: true },
    { key: 'averageWorkingHours', label: 'Avg Hours/Day', sortable: true }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isIndividualReport ? 'Daily Attendance Records' : 'Employee Summary Report'}
            </h3>
            <p className="text-sm text-gray-500">
              Showing {paginatedData.length} of {sortedData.length} records
            </p>
          </div>
          
          {data.length > 0 && (
            <button
              onClick={() => onExport?.('csv')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {data.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">No attendance records found for the selected criteria.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.key === 'status' && record.status ? (
                          <span className={getStatusBadge(record.status)}>
                            {record.status}
                          </span>
                        ) : column.key === 'workingHours' || column.key === 'totalWorkingHours' || column.key === 'averageWorkingHours' ? (
                          formatWorkingHours(record[column.key] || 0)
                        ) : column.key === 'attendancePercentage' ? (
                          `${record[column.key] || 0}%`
                        ) : column.key === 'lateMinutes' ? (
                          record[column.key] ? `${record[column.key]} min` : '-'
                        ) : column.key.includes('employee.') ? (
                          (() => {
                            const key = column.key.split('.')[1];
                            const employeeData = record.employee || {};
                            return employeeData[key] || '-';
                          })()
                        ) : (
                          record[column.key] || '-'
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === pageNum
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsTable;