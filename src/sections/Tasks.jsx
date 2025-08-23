// File: src/sections/Tasks.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TaskCard from '@/components/cards/TaskCard';
import CreateTask from '@/components/modals/createTask';
import taskService from "@/apis/services/taskService";
import ModalButton from '@/components/custom/ModalButton';
import { FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';

const PAGE_SIZE = 9;
const LIMIT = 9;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [paginationParams, setPaginationParams] = useState({
    isRefresh: true,
    pageNumber: 1,
    maxPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    assignee: 'All'
  });
  const [assignees, setAssignees] = useState([]);
  const queryRef = useRef();

  const getTasks = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const offset = (pageNumber - 1) * PAGE_SIZE;
      const res = await taskService.getAllTasks(LIMIT, offset);
      console.log(res);
      setTasks(res.data.tasks);
      setPaginationParams({
        isRefresh: false,
        pageNumber: pageNumber,
        maxPages: Math.ceil(res.data.pagination.totalTasks / PAGE_SIZE)
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const res = await taskService.updateTask(taskId, updatedTask);
      setTasks(prev => 
        prev.map(task => task.id === taskId ? res.data : task)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.log(err);
    }
  };

  const getFilteredTasksFromTheServer = async (queryParams = {}) => {
    setLoading(true);
    try {
      const response = await taskService.filteredTasks(queryParams);
      if (response) {
        setTasks(response?.data?.tasks || []);
        setPaginationParams(prev => ({
          ...prev,
          isRefresh: false,
          maxPages: Math.ceil((response?.data?.pagination?.total || 0) / PAGE_SIZE)
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get date ranges
  const getDateRange = (type) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (type) {
      case 'dueToday':
        return {
          deadlineStart: today.toISOString(),
          deadlineEnd: tomorrow.toISOString()
        };
      case 'dueThisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // Next Sunday
        return {
          deadlineStart: startOfWeek.toISOString(),
          deadlineEnd: endOfWeek.toISOString()
        };
      case 'overdue':
        return {
          deadlineEnd: today.toISOString()
        };
      default:
        return {};
    }
  };

  // Handle filter changes
  const applyFilters = useCallback(() => {
    const queryParams = {};
    
    // Add status filter - handle special date-based statuses
    if (filters.status !== 'All') {
      switch (filters.status) {
        case 'dueToday':
        case 'dueThisWeek':
        case 'overdue':
          // Add date range filters
          Object.assign(queryParams, getDateRange(filters.status));
          break;
        default:
          // Regular status filter
          queryParams.status = filters.status;
      }
    }
    
    // Add priority filter
    if (filters.priority !== 'All') {
      queryParams.priority = filters.priority;
    }

    // Add assignee filter
    if (filters.assignee !== 'All') {
      queryParams.assignedTo = filters.assignee;
    }

    // Add pagination
    queryParams.limit = LIMIT;
    queryParams.offset = (paginationParams.pageNumber - 1) * PAGE_SIZE;

    // Apply filters
    const hasFilters = filters.status !== 'All' || filters.priority !== 'All' || filters.assignee !== 'All';
    if (hasFilters) {
      getFilteredTasksFromTheServer(queryParams);
    } else {
      getTasks(paginationParams.pageNumber);
    }
  }, [filters.status, filters.priority, filters.assignee, paginationParams.pageNumber]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const addTask = useCallback(async (task) => {
    setLoading(true);
    try {
      const res = await taskService.createTask(task);
      // Refresh the current view to show the new task
      applyFilters();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [applyFilters]);

  // Pagination handlers
  const goToFirstPage = () => {
    setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
  };

  const goToPreviousPage = () => {
    if (paginationParams.pageNumber > 1) {
      setPaginationParams(prev => ({ ...prev, pageNumber: prev.pageNumber - 1 }));
    }
  };

  const goToNextPage = () => {
    if (paginationParams.pageNumber < paginationParams.maxPages) {
      setPaginationParams(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
    }
  };

  const goToLastPage = () => {
    setPaginationParams(prev => ({ ...prev, pageNumber: prev.maxPages }));
  };

  useEffect(() => {
    // Get assignees on component mount
    const getAssignees = async () => {
      try {
        const res = await taskService.getAssignees();
        setAssignees(res?.data?.assignees || []);
      } catch (error) {
        alert('error fetching assignees');
      }
    };
    getAssignees();
    
    // Initialize with default pagination params
    setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
  }, []);

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <ModalButton 
          text={"Create Task"} 
          onCreate={addTask} 
          className={"bg-black text-white px-4 py-2 rounded hover:opacity-90"} 
          Modal={CreateTask}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-center flex-wrap">
        <select
          value={filters.status}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, status: e.target.value }));
            setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="started">Not Started</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="dueToday">Due Today</option>
          <option value="dueThisWeek">Due This Week</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, priority: e.target.value }));
            setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, assignee: e.target.value }));
            setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Assignees</option>
          {assignees.map((assignee) => (
            <option key={assignee._id || assignee.id} value={assignee._id || assignee.id}>
              {assignee.name}
            </option>
          ))}
        </select>

        {/* Pagination Controls */}
        <div className="flex gap-2 items-center ml-auto">
          <button
            onClick={goToFirstPage}
            disabled={paginationParams.pageNumber === 1 || loading}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleDoubleLeft size={18} />
          </button>
          
        

          <span className="px-4 py-2 border rounded bg-gray-50">
            Page {paginationParams.pageNumber} of {paginationParams.maxPages}
          </span>

       

          <button
            onClick={goToLastPage}
            disabled={paginationParams.pageNumber === paginationParams.maxPages || loading}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleDoubleRight size={18} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Task Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No tasks found. Create your first task to get started!
            </div>
          )}
        </div>
      )}

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