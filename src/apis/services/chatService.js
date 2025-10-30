import {
    postChat,
    getChats,
    getChatMessages,
    getMessage,
    createGroup,
    renameGroup,
    addToGroup,
    removeFromGroup,
    deleteGroup
} from "@/apis/endpoints/chat";
import { getAllEmployees } from "../endpoints/auth";

const chatService = {
    // One-on-one Chat Operations
    postChat: async (userId) => {
        return await postChat(userId);
    },

    getChats: async (offset = 0, limit = 30) => {
        return await getChats(offset, limit);
    },

    // Get chat with initial messages
    getChatWithMessages: async (chatId, limit = 20) => {
        return await getChatMessages(chatId, limit);
    },

    // Get paginated messages for a chat
    getMessages: async (chatId, offset = 0, limit = 20) => {
        return await getChatMessages(chatId, limit, offset);
    },

    // Get single message by ID (for reply functionality)
    getMessage: async (messageId) => {
        return await getMessage(messageId);
    },

    // Group Chat Operations
    createGroup: async (name, users) => {
        return await createGroup(name, users);
    },

    renameGroup: async (chatId, name) => {
        return await renameGroup(chatId, name);
    },

    addToGroup: async (chatId, userId) => {
        return await addToGroup(chatId, userId);
    },

    removeFromGroup: async (chatId, userId) => {
        return await removeFromGroup(chatId, userId);
    },

    deleteGroup: async (chatId) => {
        return await deleteGroup(chatId);
    },

    getAllUsers: async () => {
        return await getAllEmployees();
    }
};

export default chatService;