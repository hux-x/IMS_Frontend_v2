// src/components/filters/ReportFilters.jsx
import React from 'react';

const ReportFilters = ({ 
  employees = [], 
  selectedEmployee, 
  month, 
  year, 
  dateRange, 
  onFilterChange, 
  loading = false 
}) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Reports</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Employee Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => onFilterChange('employee', e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">All Employees</option>
            {employees.map(employee => (
              <option key={employee._id} value={employee._id}>
                {employee.name} ({employee.position || 'No Position'})
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => onFilterChange('month', parseInt(e.target.value))}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            {months.map((monthName, index) => (
              <option key={index} value={index}>
                {monthName}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => onFilterChange('year', parseInt(e.target.value))}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            {years.map(yearOption => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col justify-end">
          <button
            onClick={() => {
              const now = new Date();
              onFilterChange('month', now.getMonth());
              onFilterChange('year', now.getFullYear());
            }}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 mb-2"
          >
            Current Month
          </button>
        </div>
      </div>

      {/* Date Range Filter (Optional) */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Date Range (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => onFilterChange('dateRange', { ...dateRange, startDate: e.target.value })}
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => onFilterChange('dateRange', { ...dateRange, endDate: e.target.value })}
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>
        </div>
        {dateRange.startDate && dateRange.endDate && (
          <button
            onClick={() => onFilterChange('dateRange', { startDate: '', endDate: '' })}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear date range
          </button>
        )}
      </div>
    </div>
  );
};

// src/components/cards/ReportSummaryCards.jsx
const SummaryCards = ({ summary, period, selectedEmployee, employees }) => {
  const formatHours = (hours) => {
    if (!hours) return '0h 0m';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const getEmployeeName = () => {
    if (!selectedEmployee) return null;
    const employee = employees.find(emp => emp._id === selectedEmployee);
    return employee?.name || 'Unknown Employee';
  };

  const cards = [
    {
      title: selectedEmployee ? 'Total Days' : 'Total Employees',
      value: selectedEmployee ? summary.totalDays : summary.totalEmployees,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-5.523-3.477-10-10-10s-10 4.477-10 10v2m10 0H7" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: selectedEmployee ? 'Days Present' : 'Total Present',
      value: summary.totalPresent,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: selectedEmployee ? 'Days Absent' : 'Total Absent',
      value: summary.totalAbsent,
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Attendance Rate',
      value: `${summary.averageAttendance}%`,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-4">
      {selectedEmployee && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900">
            Individual Report: {getEmployeeName()}
          </h3>
          <p className="text-blue-700 text-sm">Period: {period}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                {card.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Working Hours Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Working Hours Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{formatHours(summary.totalWorkingHours)}</p>
            <p className="text-sm text-gray-500">Total Hours</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{formatHours(summary.totalWorkingHours/summary.totalDays)}</p>
            <p className="text-sm text-gray-500">Average per {selectedEmployee ? 'Day' : 'Employee'}</p>
          </div>
          
        </div>
      </div>

      {/* Department Stats (if available) */}
      {summary.departmentStats && summary.departmentStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Department-wise Statistics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Working Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.departmentStats.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.attendancePercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatHours(dept.avgWorkingHours)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export { ReportFilters, SummaryCards };