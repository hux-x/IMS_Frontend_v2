import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  addChecklistTask,
  toggleChecklistTask,
  deleteChecklistTask,
  deleteProject,
  deleteProjectFiles,
} from "@/apis/endpoints/project";

const projectService = {
  createProject: async (projectData) => {
    try {
      return await createProject(projectData);
    } catch (err) {
      console.error("Service Error [createProject]:", err);
      throw err;
    }
  },

  getAllProjects: async () => {
    try {
      return await getAllProjects();
    } catch (err) {
      console.error("Service Error [getAllProjects]:", err);
      throw err;
    }
  },

  getProjectById: async (projectId) => {
    try {
      return await getProjectById(projectId);
    } catch (err) {
      console.error("Service Error [getProjectById]:", err);
      throw err;
    }
  },

  updateProject: async (projectId, updateData) => {
    try {
      return await updateProject(projectId, updateData);
    } catch (err) {
      console.error("Service Error [updateProject]:", err);
      throw err;
    }
  },

  deleteProjectFiles: async (projectId, fileData) => {
    try {
      return await deleteProjectFiles(projectId, fileData);
    } catch (err) {
      console.error("Service Error [deleteProjectFiles]:", err);
      throw err;
    }
  },

  addChecklistTask: async (projectId, task) => {
    try {
      return await addChecklistTask(projectId, task);
    } catch (err) {
      console.error("Service Error [addChecklistTask]:", err);
      throw err;
    }
  },

  toggleChecklistTask: async (projectId, taskId) => {
    try {
      return await toggleChecklistTask(projectId, taskId);
    } catch (err) {
      console.error("Service Error [toggleChecklistTask]:", err);
      throw err;
    }
  },

  deleteChecklistTask: async (projectId, taskId) => {
    try {
      return await deleteChecklistTask(projectId, taskId);
    } catch (err) {
      console.error("Service Error [deleteChecklistTask]:", err);
      throw err;
    }
  },

  deleteProject: async (projectId) => {
    try {
      return await deleteProject(projectId);
    } catch (err) {
      console.error("Service Error [deleteProject]:", err);
      throw err;
    }
  },
};

export default projectService;