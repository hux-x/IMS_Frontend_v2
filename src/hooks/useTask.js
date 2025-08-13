import { useState, useCallback } from "react";
import taskService from "@/apis/services/taskService";

const useTask = () => {

  const [allTasks, setAllTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [backlogTasks, setBacklogTasks] = useState([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const getAllTasks = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getAllTasks(limit, offset);
      setAllTasks(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyTasks = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getMyTasks(limit, offset);
      setMyTasks(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAssignedTasks = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getAssignedTasks(limit, offset);
      setAssignedTasks(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBacklogTasks = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getBacklogTasks(limit, offset);
      setBacklogTasks(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (task) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.createTask(task);
      setAllTasks(prev => [...prev, res.data]);
      if (task.assignedToMe) setMyTasks(prev => [...prev, res.data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.updateTask(taskId, updates);
      const updateList = list => list.map(t => t.id === taskId ? res.data : t);
      setAllTasks(updateList);
      setMyTasks(updateList);
      setAssignedTasks(updateList);
      setBacklogTasks(updateList);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(taskId);
      const filterList = list => list.filter(t => t.id !== taskId);
      setAllTasks(filterList);
      setMyTasks(filterList);
      setAssignedTasks(filterList);
      setBacklogTasks(filterList);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    allTasks,
    myTasks,
    assignedTasks,
    backlogTasks,
    loading,
    error,
    getAllTasks,
    getMyTasks,
    getAssignedTasks,
    getBacklogTasks,
    addTask,
    updateTask,
    deleteTask
  };
};

export default useTask;
