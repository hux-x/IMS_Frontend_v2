// File: src/sections/Tasks.jsx
import React, { useState } from 'react';
import TaskCard from '../components/cards/TaskCard';
import CreateTask from '../components/ui/createTask'; // Add this import

const Tasks = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showCreateTask, setShowCreateTask] = useState(false); // Add this state
  const [tasks, setTasks] = useState([ // Change to state so we can update it
    {
      id: 1,
      title: "Implement User Authentication",
      description: "Create login and registration system with JWT tokens",
      status: "in progress",
      priority: "high",
      assignee: "Alice Johnson",
      dueDate: "2024-07-30",
      progress: 33,
      items: 3,
      files: 1
    },
    {
      id: 2,
      title: "Design Dashboard UI",
      description: "Create responsive dashboard with analytics",
      status: "todo",
      priority: "medium",
      assignee: "Bob Smith",
      dueDate: "2024-08-15",
      progress: 0,
      items: 2,
      files: 0
    },
    {
      id: 3,
      title: "API Documentation",
      description: "Document all API endpoints",
      status: "completed",
      priority: "low",
      assignee: "Charlie Brown",
      dueDate: "2024-07-25",
      progress: 100,
      items: 2,
      files: 0
    }
  ]);

  const filteredTasks = tasks.filter((task) => {
    const matchStatus = statusFilter === 'All' || task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchPriority = priorityFilter === 'All' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchStatus && matchPriority;
  });

  const handleCreateTask = (newTask) => {
    const newTaskWithId = {
      ...newTask,
      id: tasks.length + 1,
      dueDate: newTask.deadline,
      priority: newTask.priority.toLowerCase(),
      status: newTask.status.toLowerCase(),
      files: newTask.files.length
    };
    setTasks([...tasks, newTaskWithId]);
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <button 
          onClick={() => setShowCreateTask(true)}
          className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
        >
          + Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="todo">Todo</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTask 
          onClose={() => setShowCreateTask(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default Tasks;