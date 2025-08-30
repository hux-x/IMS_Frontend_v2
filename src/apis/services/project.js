import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  addChecklistTask,
  toggleChecklistTask,
  deleteChecklistTask,
  getFilteredProjects
} from "@/apis/endpoints/projects";

const projectService = {
  // CREATE PROJECT
  createProject: async (projectData) => {
    const {
      projectTitle,
      clientName,
      clientEmail,
      clientPhone,
      status = 'pending',
      priority = 'medium',
      startDate,
      endDate,
      description,
      projectImages = [],
      attachments = [],
      createdBy
    } = projectData;

    return await createProject({
      projectTitle,
      clientName,
      clientEmail,
      clientPhone,
      status,
      priority,
      startDate,
      endDate,
      description,
      projectImages,
      attachments,
      createdBy
    });
  },

  // GET ALL PROJECTS
  getAllProjects: async () => {
    return await getAllProjects();
  },

  // GET PROJECT BY ID
  getProjectById: async (projectId) => {
    return await getProjectById(projectId);
  },

  // UPDATE PROJECT
  updateProject: async (projectId, updateData) => {
    const {
      projectTitle,
      clientName,
      clientEmail,
      clientPhone,
      status,
      priority,
      startDate,
      endDate,
      description,
      projectImages,
      attachments
    } = updateData;

    const body = {};
    if (projectTitle !== undefined) body.projectTitle = projectTitle;
    if (clientName !== undefined) body.clientName = clientName;
    if (clientEmail !== undefined) body.clientEmail = clientEmail;
    if (clientPhone !== undefined) body.clientPhone = clientPhone;
    if (status !== undefined) body.status = status;
    if (priority !== undefined) body.priority = priority;
    if (startDate !== undefined) body.startDate = startDate;
    if (endDate !== undefined) body.endDate = endDate;
    if (description !== undefined) body.description = description;
    if (projectImages !== undefined) body.projectImages = projectImages;
    if (attachments !== undefined) body.attachments = attachments;

    return await updateProject(projectId, body);
  },

  // ADD CHECKLIST TASK
  addChecklistTask: async (projectId, task) => {
    return await addChecklistTask(projectId, task);
  },

  // TOGGLE CHECKLIST TASK
  toggleChecklistTask: async (projectId, taskId) => {
    return await toggleChecklistTask(projectId, taskId);
  },

  // DELETE CHECKLIST TASK
  deleteChecklistTask: async (projectId, taskId) => {
    return await deleteChecklistTask(projectId, taskId);
  },

  // GET FILTERED PROJECTS
  getFilteredProjects: async (filters = {}) => {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== "")
    );
    return await getFilteredProjects(validFilters);
  }
};

export default projectService;