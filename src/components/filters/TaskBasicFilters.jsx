// File: src/components/filters/BasicFilters.jsx
import taskService from '@/apis/services/taskService';
import React, { useState,useEffect } from 'react';

const BasicFilters = ({ 
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
  backlogFilter,
  setBacklogFilter,
  uniqueAssignees,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilterCount,
  clearAllFilters
}) => {
  const [assignees,setAssignees ] = useState([])
    useEffect(() => {
    const fetchAssignees = async () => {
      try {
      
        const response = await taskService.getAssignees();
        setAssignees(response.data.assignees);
      } catch (error) {
        console.error('Error fetching assignees:', error);
        setAssignees([]);
      } 
    };
    fetchAssignees()
    
  }, []);
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Status</option>
        <option value="started">Not Started</option>
        <option value="inProgress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Priority</option>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <select
        value={assigneeFilter}
        onChange={(e) => setAssigneeFilter(e.target.value)}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Assignees</option>
        {assignees.map(assignee => (
          <option key={assignee._id} value={assignee._id}>
            {assignee.name}
          </option>
        ))}
      </select>

      <select
        value={backlogFilter}
        onChange={(e) => setBacklogFilter(e.target.value)}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Tasks</option>
        <option value="active">Active Tasks</option>
        <option value="backlog">Backlog Tasks</option>
      </select>

      <button
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        className="border px-3 py-2 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Advanced Filters {showAdvancedFilters ? '↑' : '↓'}
      </button>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear All ({activeFilterCount})
        </button>
      )}
    </div>
  );
};

export default BasicFilters;