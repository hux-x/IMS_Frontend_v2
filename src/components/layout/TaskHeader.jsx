// File: src/components/TaskHeader.jsx
import React from 'react';

const TaskHeader = ({ 
  filteredCount, 
  totalCount, 
  activeFilterCount, 
  onCreateTask 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Task Management</h2>
        <p className="text-gray-600">
          Showing {filteredCount} of {totalCount} tasks
          {activeFilterCount > 0 && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
          )}
        </p>
      </div>
      <button 
        onClick={onCreateTask}
        className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
      >
        + Create Task
      </button>
    </div>
  );
};

export default TaskHeader;