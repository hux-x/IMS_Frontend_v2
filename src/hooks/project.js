import { useState, useCallback } from "react";
import projectService from "@/apis/services/projectService";

const useProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET ALL PROJECTS
  const getAllProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getAllProjects();
      setProjects(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET PROJECT BY ID
  const getProjectById = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getProjectById(projectId);
      setSelectedProject(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE PROJECT
  const createProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.createProject(projectData);
      setProjects(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // UPDATE PROJECT
  const updateProject = useCallback(async (projectId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.updateProject(projectId, updateData);
      setProjects(prev => prev.map(p => p._id === projectId ? res.data : p));
      if (selectedProject?._id === projectId) setSelectedProject(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // ADD CHECKLIST TASK
  const addChecklistTask = useCallback(async (projectId, task) => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.addChecklistTask(projectId, task);
      // Update the project with new checklist
      if (selectedProject?._id === projectId) {
        setSelectedProject(prev => ({
          ...prev,
          designChecklist: res.data
        }));
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // TOGGLE CHECKLIST TASK
  const toggleChecklistTask = useCallback(async (projectId, taskId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.toggleChecklistTask(projectId, taskId);
      // Update the specific task in the checklist
      if (selectedProject?._id === projectId) {
        setSelectedProject(prev => ({
          ...prev,
          designChecklist: prev.designChecklist.map(task =>
            task._id === taskId ? res.data : task
          )
        }));
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // DELETE CHECKLIST TASK
  const deleteChecklistTask = useCallback(async (projectId, taskId) => {
    try {
      setLoading(true);
      setError(null);
      await projectService.deleteChecklistTask(projectId, taskId);
      // Remove the task from checklist
      if (selectedProject?._id === projectId) {
        setSelectedProject(prev => ({
          ...prev,
          designChecklist: prev.designChecklist.filter(task => task._id !== taskId)
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // GET FILTERED PROJECTS
  const getFilteredProjects = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getFilteredProjects(filters);
      setProjects(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to filter projects');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // CLEAR ERROR
  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    projects,
    selectedProject,
    loading,
    error,
    
    // Actions
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    addChecklistTask,
    toggleChecklistTask,
    deleteChecklistTask,
    getFilteredProjects,
    clearError,
    
    // Setters (optional)
    setSelectedProject,
    setProjects
  };
};

export default useProject;