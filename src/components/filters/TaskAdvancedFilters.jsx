// File: src/components/filters/AdvancedFilters.jsx
import React from 'react';

const AdvancedFilters = ({
  deadlineFilter,
  setDeadlineFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  customDateRange,
  setCustomDateRange
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Deadline Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline Filter
          </label>
          <select
            value={deadlineFilter}
            onChange={(e) => setDeadlineFilter(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Deadlines</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="thisWeek">Due This Week</option>
            <option value="thisMonth">Due This Month</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Date Created</option>
              <option value="deadline">Deadline</option>
              <option value="startTime">Start Time</option>
              <option value="updatedAt">Last Updated</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="assignedTo">Assignee</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border px-3 py-2 rounded hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={`Currently sorting ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Date Range
        </label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={customDateRange.dateType}
            onChange={(e) => setCustomDateRange({...customDateRange, dateType: e.target.value})}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="deadline">By Deadline</option>
            <option value="createdAt">By Creation Date</option>
            <option value="startTime">By Start Time</option>
            <option value="updatedAt">By Update Date</option>
          </select>
          
          <input
            type="date"
            value={customDateRange.startDate}
            onChange={(e) => setCustomDateRange({...customDateRange, startDate: e.target.value})}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="From date"
          />
          
          <input
            type="date"
            value={customDateRange.endDate}
            onChange={(e) => setCustomDateRange({...customDateRange, endDate: e.target.value})}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="To date"
          />

          {(customDateRange.startDate || customDateRange.endDate) && (
            <button
              onClick={() => setCustomDateRange({...customDateRange, startDate: '', endDate: ''})}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;