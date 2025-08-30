import client from "@/apis/apiClient/client";

// CREATE PROJECT (multipart/form-data)
export const createProject = async (projectData) => {
  const formData = new FormData();

  Object.keys(projectData).forEach((key) => {
    if (Array.isArray(projectData[key])) {
      projectData[key].forEach((item) => {
        // if it's file list append as file, otherwise append as string
        formData.append(key, item);
      });
    } else if (projectData[key] !== undefined && projectData[key] !== null) {
      formData.append(key, projectData[key]);
    }
  });

  return await client.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET ALL PROJECTS
export const getAllProjects = async () => {
  return await client.get("/projects");
};

// GET PROJECT BY ID
export const getProjectById = async (projectId) => {
  return await client.get(`/projects/${projectId}`);
};

// UPDATE PROJECT (multipart/form-data)
export const updateProject = async (projectId, updateData) => {
  const formData = new FormData();

  Object.keys(updateData).forEach((key) => {
    if (Array.isArray(updateData[key])) {
      updateData[key].forEach((item) => {
        formData.append(key, item);
      });
    } else if (updateData[key] !== undefined && updateData[key] !== null) {
      formData.append(key, updateData[key]);
    }
  });

  return await client.patch(`/projects/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

// FILTERED PROJECTS
export const getFilteredProjects = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return await client.get(`/projects/filter?${queryParams}`);
};

// DELETE PROJECT
export const deleteProject = async (projectId) => {
  return await client.delete(`/projects/${projectId}`);
};
