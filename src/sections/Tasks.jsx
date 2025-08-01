// File: src/sections/Tasks.jsx
import React, { useState } from 'react';
import TaskCard from '@/components/cards/TaskCard';
import CreateTask from '@/components/modals/createTask';
import ReactDOM from 'react-dom';

const Tasks = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Implement User Authentication",
      description: "Create login and registration system with JWT tokens",
      status: "inProgress", // Fixed to match your modal's expected format
      priority: "high",
      assignedTo: { name: "Alice Johnson" }, // Fixed to match expected structure
      deadline: "2024-07-30", // Changed from dueDate to deadline
      progress: 33,
      items: 3,
      files: 1,
      todoChecklist: [ // Changed from checklist to todoChecklist
        { text: "Create login form", completed: true },
        { text: "Implement JWT authentication", completed: false },
        { text: "Add user registration form", completed: false }
      ],
      attachments: ["auth-spec.pdf"] // Added attachments array
    },
    {
      id: 2,
      title: "Design Dashboard UI",
      description: "Create responsive dashboard with analytics",
      status: "started", // Fixed to match your modal's expected format
      priority: "medium",
      assignedTo: { name: "Bob Smith" },
      deadline: "2024-08-15",
      progress: 0,
      items: 2,
      files: 0,
      todoChecklist: [],
      attachments: []
    },
    {
      id: 3,
      title: "API Documentation",
      description: "Document all API endpoints",
      status: "completed",
      priority: "low",
      assignedTo: { name: "Charlie Brown" },
      deadline: "2024-07-25",
      progress: 100,
      items: 2,
      files: 0,
      todoChecklist: [],
      attachments: []
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
      deadline: newTask.deadline, // Keep as deadline
      priority: newTask.priority.toLowerCase(),
      status: newTask.status,
      attachments: newTask.attachments || []
    };
    setTasks([...tasks, newTaskWithId]);
  };

  // Add the missing update handler
  const handleUpdateTask = (updatedTask) => {
    console.log('Updating task:', updatedTask);
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  // Add the missing delete handler
  const handleDeleteTask = (taskId) => {
    console.log('Deleting task:', taskId);
    setTasks(prevTasks => 
      prevTasks.filter(task => task.id !== taskId)
    );
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
          <option value="started">Not Started</option>
          <option value="inProgress">In Progress</option>
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
          <TaskCard 
            key={task.id} 
            task={task} 
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
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