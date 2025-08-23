// File: src/components/TaskGrid.jsx
import React from 'react';
import TaskCard from '@/components/cards/TaskCard';

const TaskGrid = ({ 
  tasks, 
  activeFilterCount, 
  onClearFilters 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tasks found</div>
        <p className="text-gray-500">
          {activeFilterCount > 0 
            ? "Try adjusting your filters to see more tasks" 
            : "Create your first task to get started"
          }
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="mt-3 text-blue-600 hover:text-blue-800 underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard 
          key={task._id} 
          task={task} 
          // onUpdate={handleUpdateTask}
          // onDelete={handleDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskGrid;