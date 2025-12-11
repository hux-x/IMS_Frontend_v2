// src/apis/endpoints/repos.js
import client from "@/apis/apiClient/client";

// -----------------------------
// Repository CRUD
// -----------------------------

export const createRepository = async (data) => {
  return await client.post("/repos", data);
};

export const deleteRepository = async (repoId) => {
  return await client.delete(`/repos/${repoId}`);
};

export const getMyRepositories = async () => {
  return await client.get("/repos/me");
};

export const getTeamRepositories = async (teamId) => {
  return await client.get(`/repos/team/${teamId}`);
};

export const getAllRepositories = async () => {
  return await client.get("/repos/repositories");
};

// -----------------------------
// Files
// -----------------------------

export const uploadFiles = async (repoId, metadata) => {
  return await client.post(`/repos/${repoId}/files`, metadata);
};

export const markFileUploaded = async (fileId) => {
  return await client.patch(`/repos/files/${fileId}/mark-uploaded`);
};

export const downloadFile = async (repoId, fileId) => {
  return await client.get(`/repos/${repoId}/files/${fileId}/download`);
};

export const deleteFiles = async (repoId, fileIds) => {
  return await client.delete(`/repos/${repoId}/files`, {
    data: { fileIds }
  });
};

// -----------------------------
// Members
// -----------------------------

export const addMembersToRepository = async (repoId, members) => {
  return await client.post(`/repos/repositories/${repoId}/members`, 
    members
  );
};

export const removeMembersFromRepository = async (repoId, members) => {
  return await client.delete(`/repos/${repoId}/members`, {
    data: { members }
  });
};

export const getRepositoryFiles = async (repoId) => {
  return await client.get(`/repos/${repoId}/files`);
};
