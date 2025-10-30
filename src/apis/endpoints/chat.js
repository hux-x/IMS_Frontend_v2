import client from "@/apis/apiClient/client";

// One-on-one Chat
export const postChat = async (userId) => {
    return await client.post("/chat", { userId });
};

export const getChats = async (offset = 0, limit = 30) => {
    return await client.get(`/chat?limit=${limit}&offset=${offset}`);
};

// Get chat with initial messages (first load)
export const getChatMessages = async (chatId, limit = 20, offset = 0) => {
    // If offset is provided, use messages endpoint for pagination
    if (offset > 0) {
        return await client.get(`/chat/${chatId}/messages?offset=${offset}&limit=${limit}`);
    }
    // Otherwise use getChat endpoint for initial load with chat details
    return await client.get(`/chat/${chatId}?limit=${limit}`);
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