import client from "@/apis/apiClient/client";

// CREATE PROJECT
export const createProject = async (projectData) => {
  const formData = new FormData();
  Object.entries(projectData).forEach(([key, value]) => {
    if (key === "projectImages" || key === "attachments") {
      value.forEach((item) => formData.append(key, item));
    } else if (key === "designChecklist") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const response = await client.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// GET ALL PROJECTS
export const getAllProjects = async () => {
  const response = await client.get("/projects");
  return response.data;
};

// GET PROJECT BY ID
export const getProjectById = async (projectId) => {
  const response = await client.get(`/projects/${projectId}`);
  return response.data;
};

// UPDATE PROJECT
export const updateProject = async (projectId, updateData) => {
  const formData = new FormData();
  Object.entries(updateData).forEach(([key, value]) => {
    if (key === "projectImages" || key === "attachments") {
      value.forEach((item) => formData.append(key, item));
    } else if (key === "designChecklist") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const response = await client.patch(`/projects/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// DELETE PROJECT FILES
export const deleteProjectFiles = async (projectId, { removeImages, removeAttachments }) => {
  const response = await client.delete(`/projects/${projectId}/files`, {
    data: { removeImages, removeAttachments },
  });
  return response.data;
};

// ADD CHECKLIST TASK
export const addChecklistTask = async (projectId, task) => {
  const response = await client.post(`/projects/${projectId}/checklist`, { task });
  return response.data;
};

// TOGGLE CHECKLIST TASK
export const toggleChecklistTask = async (projectId, taskId) => {
  const response = await client.patch(`/projects/${projectId}/checklist/${taskId}/toggle`);
  return response.data;
};

// DELETE CHECKLIST TASK
export const deleteChecklistTask = async (projectId, taskId) => {
  const response = await client.delete(`/projects/${projectId}/checklist/${taskId}`);
  return response.data;
};

// DELETE PROJECT
export const deleteProject = async (projectId) => {
  const response = await client.delete(`/projects/${projectId}`);
  return response.data;
};