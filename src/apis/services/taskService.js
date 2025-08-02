import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    filteredTasks,
    getMyTasks,
    getAssignedTasks,
    getTaskById,
} from "@/apis/endpoints/tasks";

const taskService = {
    getAllTasks: async (limit = 10, offset = 0) => {
        return await getAllTasks(limit, offset);
    },

    createTask: async ({ assignedTo, title, description, attachments = [], deadline, startTime, teamId, priority = 'medium' }) => { //{} ==> newTask
        return await createTask(assignedTo, title, description, attachments, deadline, startTime, teamId, priority);
    },

    updateTask: async (taskId, { title = null, description = null, attachments = null, deadline = null, priority = null }) => {  //{} ==> newTask
        return await updateTask(taskId, title, description, attachments, deadline, priority);
    },

    deleteTask: async (taskId) => {
        return await deleteTask(taskId);
    },

    filteredTasks: async (limit = 10, offset = 0, status = null, priority = null) => {
        return await filteredTasks(limit, offset, status, priority);
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
