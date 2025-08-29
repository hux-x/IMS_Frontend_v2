import client from "@/apis/apiClient/client";

// CREATE PROJECT
export const createProject = async (projectData) => {
  return await client.post("/projects", projectData);
};

// GET ALL PROJECTS
export const getAllProjects = async () => {
  return await client.get("/projects");
};

// GET PROJECT BY ID
export const getProjectById = async (projectId) => {
  return await client.get(`/projects/${projectId}`);
};

// UPDATE PROJECT
export const updateProject = async (projectId, updateData) => {
  return await client.patch(`/projects/${projectId}`, updateData);
};

// ADD CHECKLIST TASK
export const addChecklistTask = async (projectId, task) => {
  return await client.post(`/projects/${projectId}/checklist`, { task });
};

// TOGGLE CHECKLIST TASK
export const toggleChecklistTask = async (projectId, taskId) => {
  return await client.patch(`/projects/${projectId}/checklist/${taskId}/toggle`);
};

// DELETE CHECKLIST TASK
export const deleteChecklistTask = async (projectId, taskId) => {
  return await client.delete(`/projects/${projectId}/checklist/${taskId}`);
};

// GET PROJECTS WITH FILTERS (optional)
export const getFilteredProjects = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return await client.get(`/projects/filter?${queryParams}`);
};
export const deleteProject = async (projectId) => {
  return await client.delete(`/projects/${projectId}`);
};