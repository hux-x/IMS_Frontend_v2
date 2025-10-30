// socketService.js
import io from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.emit('setup', userId);

  socket.on('connected', () => {
    console.log('Socket connected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

const socketService = {
  // Join chat room
  joinChat: (chatId) => {
    if (socket?.connected) {
      socket.emit('join chat', chatId);
    }
  },

  // Leave chat room
  leaveChat: (chatId) => {
    if (socket?.connected) {
      socket.emit('leave chat', chatId);
    }
  },

  // Send message
  sendMessage: (chatId, senderId, message, messageType = 'text', fileData = null) => {
    if (socket?.connected) {
      const messageData = {
        chatId: chatId?.toString(),
        senderId: senderId?.toString(),
        message: message?.trim(),
        messageType,
        fileUrl: fileData?.fileUrl || null,
        fileName: fileData?.fileName || null,
        fileSize: fileData?.fileSize || null,
      };
      console.log('📤 Sending message:', messageData);
      socket.emit('new message', messageData);
    } else {
      console.error('❌ Socket not connected');
    }
  },

  // Listen for new messages
  onMessageReceived: (callback) => {
    if (socket?.connected) {
      socket.on('message received', callback);
    }
  },

  // Remove message received listener
  offMessageReceived: () => {
    if (socket?.connected) {
      socket.off('message received');
    }
  },

  // Enhanced typing indicators with user identification
  sendTyping: (chatId, userId) => {
    if (socket?.connected) {
      socket.emit('typing', { chatId, userId });
    }
  },

  sendStopTyping: (chatId, userId) => {
    if (socket?.connected) {
      socket.emit('stop typing', { chatId, userId });
    }
  },

  // Listen for typing indicators
  onUserTyping: (callback) => {
    if (socket?.connected) {
      socket.on('typing', callback);
    }
  },

  offUserTyping: () => {
    if (socket?.connected) {
      socket.off('typing');
    }
  },

  // Listen for stop typing
  onUserStopTyping: (callback) => {
    if (socket?.connected) {
      socket.on('stop typing', callback);
    }
  },

  offUserStopTyping: () => {
    if (socket?.connected) {
      socket.off('stop typing');
    }
  },

  // Enhanced Mark as read - One-on-one chats
  markMessageAsRead: (messageId, userId) => {
    if (socket?.connected) {
      socket.emit('mark as read', { messageId, userId });
    }
  },

  // Listen for one-on-one read status
  onMessageRead: (callback) => {
    if (socket?.connected) {
      socket.on('message read', callback);
    }
  },

  offMessageRead: () => {
    if (socket?.connected) {
      socket.off('message read');
    }
  },

  // Get read status - One-on-one chats
  getMessageReadStatus: (messageId) => {
    if (socket?.connected) {
      socket.emit('get message read status', messageId);
    }
  },

  onMessageReadStatus: (callback) => {
    if (socket?.connected) {
      socket.on('message read status', callback);
    }
  },

  offMessageReadStatus: () => {
    if (socket?.connected) {
      socket.off('message read status');
    }
  },

  // Mark as read - Group chats
  markMessageAsReadByUser: (messageId, userId) => {
    if (socket?.connected) {
      socket.emit('mark as read by user', { messageId, userId });
    }
  },

  // Listen for group read status updates
  onMessageReadByUser: (callback) => {
    if (socket?.connected) {
      socket.on('message read by user', callback);
    }
  },

  offMessageReadByUser: () => {
    if (socket?.connected) {
      socket.off('message read by user');
    }
  },

  // Get read status - Group chats
  getGroupMessageReadStatus: (messageId) => {
    if (socket?.connected) {
      socket.emit('get group message read status', messageId);
    }
  },

  onGroupMessageReadStatus: (callback) => {
    if (socket?.connected) {
      socket.on('group message read status', callback);
    }
  },

  offGroupMessageReadStatus: () => {
    if (socket?.connected) {
      socket.off('group message read status');
    }
  },

  // User online/offline status
  onUserOnline: (callback) => {
    if (socket?.connected) {
      socket.on('user online', callback);
    }
  },

  offUserOnline: () => {
    if (socket?.connected) {
      socket.off('user online');
    }
  },

  onUserOffline: (callback) => {
    if (socket?.connected) {
      socket.on('user offline', callback);
    }
  },

  offUserOffline: () => {
    if (socket?.connected) {
      socket.off('user offline');
    }
  },

  // Get specific user online status
  getUserOnlineStatus: (userId) => {
    if (socket?.connected) {
      socket.emit('get user online status', userId);
    }
  },

  onUserOnlineStatus: (callback) => {
    if (socket?.connected) {
      socket.on('user online status', callback);
    }
  },

  offUserOnlineStatus: () => {
    if (socket?.connected) {
      socket.off('user online status');
    }
  },

  // Get all online users in a chat
  getOnlineUsersInChat: (chatId) => {
    if (socket?.connected) {
      socket.emit('get online users in chat', chatId);
    }
  },

  onOnlineUsersInChat: (callback) => {
    if (socket?.connected) {
      socket.on('online users in chat', callback);
    }
  },

  offOnlineUsersInChat: () => {
    if (socket?.connected) {
      socket.off('online users in chat');
    }
  },

  // User viewing chat (one-on-one chats)
  onUserViewingChat: (callback) => {
    if (socket?.connected) {
      socket.on('user viewing chat', callback);
    }
  },

  offUserViewingChat: () => {
    if (socket?.connected) {
      socket.off('user viewing chat');
    }
  },

  // Clear chat
  clearChat: (chatId) => {
    if (socket?.connected) {
      socket.emit('clear chat', chatId);
    }
  },

  onChatCleared: (callback) => {
    if (socket?.connected) {
      socket.on('chat cleared', callback);
    }
  },

  offChatCleared: () => {
    if (socket?.connected) {
      socket.off('chat cleared');
    }
  },

  // Delete chat
  deleteChat: (chat, authUserId) => {
    if (socket?.connected) {
      socket.emit('delete chat', { chat, authUserId });
    }
  },

  onChatDeleted: (callback) => {
    if (socket?.connected) {
      socket.on('delete chat', callback);
    }
  },

  offChatDeleted: () => {
    if (socket?.connected) {
      socket.off('delete chat');
    }
  },

  // Chat created
  notifyNewChat: (chat, authUserId) => {
    if (socket?.connected) {
      socket.emit('chat created', { chat, authUserId });
    }
  },

  onChatCreated: (callback) => {
    if (socket?.connected) {
      socket.on('chat created', callback);
    }
  },

  offChatCreated: () => {
    if (socket?.connected) {
      socket.off('chat created');
    }
  },

  // Room joined
  onRoomJoined: (callback) => {
    if (socket?.connected) {
      socket.on('joined room', callback);
    }
  },

  offRoomJoined: () => {
    if (socket?.connected) {
      socket.off('joined room');
    }
  },

  // Remove specific listener
  removeListener: (event) => {
    if (socket?.connected) {
      socket.off(event);
    }
  },

  // Remove all listeners
  removeAllListeners: () => {
    if (socket?.connected) {
      socket.removeAllListeners();
    }
  },
};

export default socketService;