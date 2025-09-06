import { useState, useCallback } from "react";
import projectService from "@/apis/services/project";

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
      const response = await projectService.getAllProjects();
      const projects = Array.isArray(response) ? response : response.data || [];
      setProjects(projects);
      return projects;
    } catch (err) {
      const message = err.response?.data?.error || "Failed to fetch projects";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET PROJECT BY ID
  const getProjectById = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProjectById(projectId);
      const project = response.data || response;
      setSelectedProject(project);
      return project;
    } catch (err) {
      const message = err.response?.data?.error || "Failed to fetch project";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE PROJECT
  const createProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      const filteredData = {
        ...projectData,
        projectImages: projectData.projectImages?.filter((item) => item instanceof File) || [],
        attachments: projectData.attachments?.filter((item) => item instanceof File) || [],
      };
      const response = await projectService.createProject(filteredData);
      const newProject = response.data || response;
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const message = err.response?.data?.error || "Failed to create project";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // UPDATE PROJECT
  const updateProject = useCallback(async (projectId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const filteredData = {
        ...updateData,
        projectImages: updateData.projectImages?.filter((item) => item instanceof File) || [],
        attachments: updateData.attachments?.filter((item) => item instanceof File) || [],
      };
      const response = await projectService.updateProject(projectId, filteredData);
      const updatedProject = response.data || response;
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      if (selectedProject?._id === projectId) {
        setSelectedProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      const message = err.response?.data?.error || "Failed to update project";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // DELETE PROJECT FILES
  const deleteProjectFiles = useCallback(async (projectId, fileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.deleteProjectFiles(projectId, fileData);
      const updatedProject = response.data || response;
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      if (selectedProject?._id === projectId) {
        setSelectedProject(updatedProject);
      }
      return response.deletedFiles || { images: [], attachments: [] };
    } catch (err) {
      const message = err.response?.data?.error || "Failed to delete files";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // ADD CHECKLIST TASK
  const addChecklistTask = useCallback(async (projectId, task) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.addChecklistTask(projectId, task);
      const updatedChecklist = response.data || response;
      if (selectedProject?._id === projectId) {
        setSelectedProject((prev) => ({
          ...prev,
          designChecklist: updatedChecklist,
        }));
      }
      return updatedChecklist;
    } catch (err) {
      const message = err.response?.data?.error || "Failed to add task";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // TOGGLE CHECKLIST TASK
  const toggleChecklistTask = useCallback(async (projectId, taskId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.toggleChecklistTask(projectId, taskId);
      const updatedTask = response.data || response;
      if (selectedProject?._id === projectId) {
        setSelectedProject((prev) => ({
          ...prev,
          designChecklist: prev.designChecklist.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
        }));
      }
      return updatedTask;
    } catch (err) {
      const message = err.response?.data?.error || "Failed to toggle task";
      setError(message);
      throw new Error(message);
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
      if (selectedProject?._id === projectId) {
        setSelectedProject((prev) => ({
          ...prev,
          designChecklist: prev.designChecklist.filter((task) => task._id !== taskId),
        }));
      }
    } catch (err) {
      const message = err.response?.data?.error || "Failed to delete task";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // DELETE PROJECT
  const deleteProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      await projectService.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
      }
    } catch (err) {
      const message = err.response?.data?.error || "Failed to delete project";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // CLEAR ERROR
  const clearError = useCallback(() => setError(null), []);

  return {
    projects,
    selectedProject,
    loading,
    error,
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProjectFiles,
    addChecklistTask,
    toggleChecklistTask,
    deleteChecklistTask,
    deleteProject,
    clearError,
    setProjects,
    setSelectedProject,
  };
};

export default useProject;