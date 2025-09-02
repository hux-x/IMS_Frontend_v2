import { useCallback, useEffect, useRef, useState } from 'react';
import taskService from "@/apis/services/taskService";
 const useTasks = () => {
  const LIMIT = 9;
  const PAGE_SIZE = 9
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
      console.log(res.data)
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

  const handleUpdateTask = useCallback(async (taskId, updatedTask) => {
  
    try {
      
      const res = await taskService.updateTask(updatedTask._id, updatedTask);
    
      setTasks(prev => 
        prev.map(task => task._id === taskId ? res.data.task : task)
      );
    } catch (err) {
      console.log(err);
    }
  },[])

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      const res = await taskService.deleteTask(taskId);
      console.log(res)
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      console.log(err);
    }
  },[])

  const getFilteredTasksFromTheServer = useCallback(async (queryParams = {}) => {
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
  },[])

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


  useEffect(() => {
    // Get assignees on component mount
    const getAssignees = async () => {
      try {
        const res = await taskService.getAssigneesForFilteration();
        setAssignees(res?.data?.assignees || []);
      } catch (error) {
        alert('error fetching assignees');
      }
    };
    getAssignees();
    
    setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
  }, []);


  return {tasks,
    loading,
    showCreateTask,
    setShowCreateTask,
    filters,
    setFilters,
    assignees,
    paginationParams,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    addTask,
    handleUpdateTask,
    handleDeleteTask
  }
}
export default useTasks;