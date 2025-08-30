import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  addChecklistTask,
  toggleChecklistTask,
  deleteProject,
  deleteChecklistTask,
  getFilteredProjects,
} from "@/apis/endpoints/project";

const projectService = {
  createProject: async (projectData) => {
    return await createProject(projectData);
  },

  getAllProjects: async () => {
    return await getAllProjects();
  },

  getProjectById: async (projectId) => {
    return await getProjectById(projectId);
  },

  updateProject: async (projectId, updateData) => {
    return await updateProject(projectId, updateData);
  },

  addChecklistTask: async (projectId, task) => {
    return await addChecklistTask(projectId, task);
  },

  toggleChecklistTask: async (projectId, taskId) => {
    return await toggleChecklistTask(projectId, taskId);
  },

  deleteChecklistTask: async (projectId, taskId) => {
    return await deleteChecklistTask(projectId, taskId);
  },

  getFilteredProjects: async (filters = {}) => {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== "")
    );
    return await getFilteredProjects(validFilters);
  },

  deleteProject: async (projectId) => {
    return await deleteProject(projectId);
  },
};

export default projectService;
