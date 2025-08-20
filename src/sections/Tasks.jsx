// File: src/sections/Tasks.jsx
import React, { useCallback, useEffect, useState } from 'react';
import TaskCard from '@/components/cards/TaskCard';
import CreateTask from '@/components/modals/createTask';
import taskService from "@/apis/services/taskService";

const Tasks = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  const [showCreateTask, setShowCreateTask] = useState(false);


  const [allTasks, setAllTasks] = useState([]);
  const getTasks = async (limit = 10, offset = 0) => {
    try {
      const res = await taskService.getAllTasks(limit, offset)
      console.log(res)
      setAllTasks(res.data.tasks);
    } catch (err) {
      console.log(err)
    } finally {
      
    }
  }
  const addTask = useCallback(async (task) => {
    try {
      const res = await taskService.createTask(task);
      setAllTasks(prev => [...prev, res.data]);
      if (task.assignedToMe) setMyTasks(prev => [...prev, res.data.task]);
    } catch (err) {
      console.log(err)
    } finally {
      
    }
  },[])
 
  

useEffect(()=>{
  getTasks()
},[])

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
        {allTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            // onUpdate={handleUpdateTask}
            // onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTask 
          onClose={() => setShowCreateTask(false)}
          onCreate={addTask}
        />
      )}
    </div>
  );
};

export default Tasks;