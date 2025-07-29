// File: src/pages/Tasks.jsx
import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';
import tasksData from '../data/tasks';

const Tasks = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = tasksData.filter(task => {
    const statusMatch = statusFilter === 'All' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <button className="bg-black text-white px-4 py-2 rounded hover:opacity-90">Create Task</button>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="todo">Todo</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="border px-3 py-2 rounded"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
