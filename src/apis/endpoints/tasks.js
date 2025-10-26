// Updated tasks endpoints with file upload support
import client from "@/apis/apiClient/client";

export const createTask = async (
    assignedTo, // Now an array of assignee IDs
    title,
    description,
    files = [], // Array of File objects
    deadline,
    startTime,
    teamId,
    priority = 'medium',
    todoChecklist
) => {
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    console.log(assignedTo, title, deadline, teamId, todoChecklist, "TESTINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
    
    // Append all task data
    // Handle assignedTo as array - append each ID separately
    if (Array.isArray(assignedTo) && assignedTo.length > 0) {
        assignedTo.forEach((id) => {
            formData.append('assignedTo', id); // Backend will receive multiple values
        });
    } else if (typeof assignedTo === 'string' && assignedTo) {
        formData.append('assignedTo', assignedTo); // Fallback for single string
    }
    
    formData.append('title', title);
    formData.append('description', description);
    formData.append('deadline', deadline);
    formData.append('startTime', startTime);
    formData.append('teamId', teamId);
    formData.append('priority', priority);
    
    // Append todoChecklist as JSON string
    if (todoChecklist && todoChecklist.length > 0) {
        formData.append('todoChecklist', JSON.stringify(todoChecklist));
    }
    
    // Append files
    if (files && files.length > 0) {
        files.forEach((file) => {
            if (file instanceof File) {
                formData.append('attachments', file); // Use 'attachments' to match backend expectation
            }
        });
    }
    
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    return await client.post("/tasks/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const reassignTask = async (taskId, newAssigneeIds) => {
    // Updated to handle multiple assignees
    return await client.put(`/tasks/reassign`, { 
        newAssigneeIds: Array.isArray(newAssigneeIds) ? newAssigneeIds : [newAssigneeIds], 
        taskId 
    });
};

export const fetchAssignees = async () => {
    return await client.get('/tasks/assignees');
}

export const updateTask = async (taskId, title = null, description = null, attachments = null, deadline = null, priority = null, todoChecklist = null, status = null) => {
    const updateData = {}
    if (title !== null) updateData.title = title;
    if (description !== null) updateData.description = description;
    if (attachments !== null) updateData.attachments = attachments;
    if (deadline !== null) updateData.deadline = deadline;
    if (priority !== null) updateData.priority = priority;
    if (status !== null) updateData.status = status;
    if (todoChecklist !== null) updateData.todoChecklist = todoChecklist;
    console.log(updateData);
    
    return await client.put(`/tasks/update/${taskId}`, updateData);
}

export const filteredTasks = async (queryParams) => {
    return await client.get(`/tasks/filter?${queryParams}`);
}

export const getAllTasks = async (limit, offset) => {
    return await client.get(`/tasks/adminTasks?limit=${limit}&offset=${offset}`);
}

export const getMyTasks = async (limit, offset) => {
    return await client.get(`/tasks/my-tasks?limit=${limit}&offset=${offset}`);
}

export const getAssignedTasks = async (limit, offset) => {
    return await client.get(`/tasks/assigned?limit=${limit}&offset=${offset}`);
}

export const getTaskById = async (taskId) => {
    return await client.get(`/tasks/${taskId}`);
}

export const deleteTask = async (taskId) => {
    return await client.delete(`/tasks/${taskId}`);
}

export const getAssigneesForFiltering = async () => {
    return await client.get("/tasks/filterAssignees");
}