// src/apis/services/reposService.js
import {
  createRepository,
  deleteRepository,
  getMyRepositories,
  getTeamRepositories,
  getAllRepositories,
  uploadFiles,
  markFileUploaded,
  downloadFile,
  deleteFiles,
  addMembersToRepository,
  removeMembersFromRepository,
  getRepositoryFiles,
} from "@/apis/endpoints/repos";

const reposService = {
  
  createRepository: async (data) => {
    return await createRepository(data);
  },

  deleteRepository: async (repoId) => {
    return await deleteRepository(repoId);
  },

  getMyRepositories: async () => {
    return await getMyRepositories();
  },

  getTeamRepositories: async (teamId) => {
    return await getTeamRepositories(teamId);
  },

  getAllRepositories: async () => {
    return await getAllRepositories();
  },

  // -----------------------------
  // Files
  // -----------------------------

  uploadFiles: async (repoId, filesMetadata) => {
    return await uploadFiles(repoId, filesMetadata);
  },

  markFileUploaded: async (fileId) => {
    return await markFileUploaded(fileId);
  },

  downloadFile: async (repoId, fileId) => {
    return await downloadFile(repoId, fileId);
  },

  deleteFiles: async (repoId, fileIds) => {
    return await deleteFiles(repoId, fileIds);
  },

  // -----------------------------
  // Members
  // -----------------------------

  addMembers: async (repoId, members) => {
    return await addMembersToRepository(repoId, members);
  },

  removeMembers: async (repoId, members) => {
    return await removeMembersFromRepository(repoId, members);
  }
,
  getRepositoryFiles: async (repoId) => {
    return await getRepositoryFiles(repoId);
  }

};

export default reposService;
