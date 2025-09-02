import client from "@/apis/apiClient/client";

export const createTask = async (
      assignedTo,
      title,
      description,
      attachments = [],
      deadline,
      startTime,
      teamId,
      priority = 'medium',
      todoChecklist) => {
    return await client.post("/tasks/create", {
        assignedTo,
        teamId, 
        title, 
        description, 
        attachments, 
        deadline, 
        startTime, 
        priority,
        todoChecklist
    });
};


export const reassignTask = async (taskId, newAssigneeId) => {
    return await client.put(`/tasks/reassign`, {newAssigneeId,taskId});
};
export const fetchAssignees = async()=>{
    return await client.get('/tasks/assignees');
}
export const updateTask = async(taskId,title=null,description=null,attachments=null,deadline=null,priority=null,todoChecklist=null,status=null)=>{
    const updateData = {}
    if (title !== null) updateData.title = title;
    if (description !== null) updateData.description = description;
    if (attachments !== null) updateData.attachments = attachments;
    if (deadline !== null) updateData.deadline = deadline;
    if (priority !== null) updateData.priority = priority;
    if(status!== null) updateData.status = status
    if(todoChecklist!== null) updateData.todoChecklist = todoChecklist
    console.log(updateData)
    
    return await client.put(`/tasks/update/${taskId}`, updateData);
  
}

export const filteredTasks = async(queryParams)=>{
    return await client.get(`/tasks/filter?${queryParams}`);
}

export const getAllTasks = async(limit,offset)=>{
    return await client.get(`/tasks/adminTasks?limit=${limit}&offset=${offset}`);
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

export const getAssigneesForFiltering = async()=>{
    return await client.get("/tasks/filterAssignees")
}