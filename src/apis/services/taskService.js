import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    filteredTasks,
    getMyTasks,
    getAssignedTasks,
    getTaskById,
    fetchAssignees
} from "@/apis/endpoints/tasks";

const taskService = {
    getAllTasks: async (limit = 10, offset = 0) => {
        return await getAllTasks(limit, offset);
    },

    getAssignees: async () => {
        const res = await fetchAssignees();
        console.log(res);
        return res;
    },

    createTask: async ({ assignedTo, title, description, attachments = [], deadline, startTime, teamId, priority = 'medium' }) => {
        return await createTask(assignedTo, title, description, attachments, deadline, startTime, teamId, priority);
    },

    updateTask: async (taskId, { title = null, description = null, attachments = null, deadline = null, priority = null }) => {
        return await updateTask(taskId, title, description, attachments, deadline, priority);
    },

    deleteTask: async (taskId) => {
        return await deleteTask(taskId);
    },


    filteredTasks: async (filters = {}) => {
        const queryParams = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== "" && v !== "All")
        );
        console.log(queryParams)
        const queryString = new URLSearchParams(queryParams).toString();

        return await filteredTasks(queryString);
    },

    getMyTasks: async (limit = 10, offset = 0) => {
        return await getMyTasks(limit, offset);
    },

    getAssignedTasks: async (limit = 10, offset = 0) => {
        return await getAssignedTasks(limit, offset);
    },

    getTaskById: async (taskId) => {
        return await getTaskById(taskId);
    },

    reassignTask: async (taskId, newAssigneeId) => {
        return await reassignTask(taskId, newAssigneeId);
    },

    getBacklogTasks: async (limit = 10, offset = 0) => {
        return await getBacklogTasks(limit, offset);
    },
};

export default taskService;
