import client from "@/apis/apiClient/client";

// One-on-one Chat
export const postChat = async (userId) => {
    return await client.post("/chat", { userId });
};

export const getChats = async (offset = 0, limit = 30) => {
    return await client.get(`/chat?limit=${limit}&offset=${offset}`);
};

// Get chat with initial messages (first load) or paginated messages with cursor
export const getChatMessages = async (chatId, limit = 20, cursor = null) => {
    let url = `/chat/${chatId}?limit=${limit}`;
    
    // Only append cursor if it exists and is not null/undefined
    if (cursor) {
        url += `&cursor=${cursor}`;
    }
    
    return await client.get(url);
};

// Get single message by ID (for reply functionality)
export const getMessage = async (messageId) => {
    return await client.get(`/chat/message/${messageId}`);
};

// Group Chat
export const createGroup = async (name, users) => {
    return await client.post("/chat/group", { name, users });
};

export const renameGroup = async (chatId, name) => {
    return await client.post("/chat/rename", { chatId, name });
};

export const addToGroup = async (chatId, userId) => {
    return await client.post("/chat/groupadd", { chatId, userId });
};

export const removeFromGroup = async (chatId, userId) => {
    return await client.post("/chat/groupremove", { chatId, userId });
};

export const deleteGroup = async (chatId) => {
    return await client.delete(`/chat/deleteGroup/${chatId}`);
};