import client from "@/apis/apiClient/client";

export const createTask = async (
      assignedTo,
      title,
      description,
      attachments = [],
      deadline,
      startTime,
      teamId,
      priority = 'medium',) => {
    return await client.post("/tasks/create", {assignedTo,teamId, title, description, attachments, deadline, startTime, priority});
};

export const reassignTask = async (taskId, newAssigneeId) => {
    return await client.put(`/tasks/reassign`, {newAssigneeId,taskId});
};
export const fetchAssignees = async()=>{
    return await client.get('/tasks//assginees');
}
export const updateTask = async(taskId,title=null,description=null,attachments=null,deadline=null,priority=null)=>{
    return await client.put(`/tasks/update/${taskId}`, {title,description,attachments,deadline,priority});
}

export const filteredTasks = async(limit,offset,status=null,priority=null)=>{
    return await client.get(`/tasks/filter?limit=${limit}&offset=${offset}&status=${status}&priority=${priority}`);
}

export const getAllTasks = async(limit,offset)=>{
    return await client.get(`/tasks/all?limit=${limit}&offset=${offset}`);
}

export const getMyTasks = async(limit,offset)=>{
    return await client.get(`/tasks/my-tasks?limit=${limit}&offset=${offset}`);
}

export const getAssignedTasks = async(limit,offset)=>{
    return await client.get(`/tasks/assigned?limit=${limit}&offset=${offset}`);
}
export const getTaskById = async(taskId)=>{
    return await client.get(`/tasks/${taskId}`);
}

export const deleteTask = async(taskId)=>{
    return await client.delete(`/tasks/${taskId}`);
}