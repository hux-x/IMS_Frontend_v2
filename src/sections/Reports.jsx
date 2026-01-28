// src/pages/ReportsPage.jsx
import React, { useEffect } from 'react';
import { useAttendanceReports } from '@/hooks/useAttendanceReports';
import {ReportFilters} from '@/components/filters/ReportFilters';
import {SummaryCards} from '@/components/filters/ReportFilters';
import ReportsTable from '@/components/layout/ReportsTable';
import {LoadingSpinner} from '@/components/ui/LoadingSpinner';
import {ErrorMessage} from '@/components/ui/LoadingSpinner';

const ReportsPage = () => {
  const {
    reports,
    summary,
    employees,
    loading,
    error,
    selectedEmployee,
    setSelectedEmployee,
    month,
    setMonth,
    year,
    setYear,
    dateRange,
    setDateRange,
    generateMonthlyReport,
    getAttendanceHistory,
    exportReport,
    refreshData,
    clearError
  } = useAttendanceReports();

  // Clear any initial errors from the hook's mount behavior
  useEffect(() => {
    if (error && !selectedEmployee) {
      clearError();
    }
  }, [error, selectedEmployee, clearError]);

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'employee':
        setSelectedEmployee(value);
        if (value) {
          // Only fetch data when specific employee is selected
          const startDate = new Date(year, month, 1).toISOString().split('T')[0];
          const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
          getAttendanceHistory(startDate, endDate, value);
        }
        // Removed the else clause - no automatic monthly report generation
        break;
      case 'month':
        setMonth(value);
        if (selectedEmployee) {
          // Only fetch if employee is already selected
          const startDate = new Date(year, value, 1).toISOString().split('T')[0];
          const endDate = new Date(year, value + 1, 0).toISOString().split('T')[0];
          getAttendanceHistory(startDate, endDate, selectedEmployee);
        }
        break;
      case 'year':
        setYear(value);
        if (selectedEmployee) {
          // Only fetch if employee is already selected
          const startDate = new Date(value, month, 1).toISOString().split('T')[0];
          const endDate = new Date(value, month + 1, 0).toISOString().split('T')[0];
          getAttendanceHistory(startDate, endDate, selectedEmployee);
        }
        break;
      case 'dateRange':
        setDateRange(value);
        if (value.startDate && value.endDate && selectedEmployee) {
          // Only fetch if employee is selected
          getAttendanceHistory(value.startDate, value.endDate, selectedEmployee);
        }
        break;
      default:
        break;
    }
  };

  const handleExport = (format = 'csv') => {
    exportReport(format);
  };

  const getCurrentPeriod = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (dateRange.startDate && dateRange.endDate) {
      return `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`;
    }
    
    return `${months[month]} ${year}`;
  };

  if (error && selectedEmployee) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-gray-600">Generate and analyze attendance reports</p>
        </div>
        
        <ErrorMessage 
          message={error} 
          onRetry={refreshData}
          onDismiss={clearError}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-gray-600">
            {selectedEmployee ? 
              `Individual report for ${employees.find(emp => emp._id === selectedEmployee)?.name || 'Selected Employee'}` :
              'Select an employee to view their attendance report'
            }
          </p>
          {selectedEmployee && (
            <p className="text-sm text-gray-500 mt-1">
              Period: {getCurrentPeriod()}
            </p>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={refreshData}
            disabled={loading || !selectedEmployee}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
          
          <button
            onClick={() => handleExport('csv')}
            disabled={loading || !reports.length}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <ReportFilters
        employees={employees}
        selectedEmployee={selectedEmployee}
        month={month}
        year={year}
        dateRange={dateRange}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Generating reports...</span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {selectedEmployee && reports.length > 0 && (
            <>
              {/* Summary Cards */}
              <SummaryCards 
                summary={summary} 
                period={getCurrentPeriod()}
                selectedEmployee={selectedEmployee}
                employees={employees}
              />

              {/* Reports Table */}
              <ReportsTable 
                data={reports} 
                loading={loading}
                selectedEmployee={selectedEmployee}
                employees={employees}
                onExport={handleExport}
              />
            </>
          )}

          {/* No Employee Selected State */}
          {!selectedEmployee && !loading && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Employee Selected</h3>
              <p className="text-gray-500 mb-6">
                Please select an employee from the filters above to view their attendance report.
              </p>
            </div>
          )}

          {/* No Data State (Employee selected but no reports) */}
          {selectedEmployee && !reports.length && !loading && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available</h3>
              <p className="text-gray-500 mb-6">
                No attendance data found for {employees.find(emp => emp._id === selectedEmployee)?.name || 'this employee'} during the selected period. 
                Try adjusting your date range or check if attendance has been recorded.
              </p>
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Refresh Data
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;