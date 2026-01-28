// socketService.js - FIXED VERSION
import io from 'socket.io-client';

let socket = null;
let currentUserId = null;

export const connectSocket = (userId) => {
  currentUserId = userId;

  // If socket exists and is connected, just ensure setup
  if (socket?.connected) {
    console.log('✅ Socket already connected');
    if (socket.userId !== userId) {
      socket.emit('setup', userId);
      socket.userId = userId;
    }
    return socket;
  }

  // Clean up existing socket if disconnected
  if (socket && !socket.connected) {
    socket.removeAllListeners();
    socket = null;
  }

  // Create new socket connection
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.userId = userId;

  // Handle connection
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    socket.emit('setup', userId);
  });

  // Handle reconnection
  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    socket.emit('setup', userId);
  });

  socket.on('connected', (data) => {
    console.log('✅ Setup confirmed:', data);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentUserId = null;
    console.log('🔌 Socket disconnected');
  }
};

export const getSocket = () => socket;

export const isSocketConnected = () => socket?.connected || false;

const socketService = {
  // Join chat room
  joinChat: (chatId) => {
    if (!socket?.connected) {
      console.error('❌ Socket not connected');
      return false;
    }
    socket.emit('join chat', chatId);
    console.log('✅ Joining chat:', chatId);
    return true;
  },

  // Leave chat room
  leaveChat: (chatId) => {
    if (!socket?.connected) return false;
    socket.emit('leave chat', chatId);
    console.log('👋 Leaving chat:', chatId);
    return true;
  },

  // Send message with reply support
  sendMessage: (chatId, senderId, message, messageType = 'text', fileData = null, replyToId = null) => {
    if (!socket?.connected) {
      console.error('❌ Socket not connected');
      return false;
    }

    const messageData = {
      chatId: chatId?.toString(),
      senderId: senderId?.toString(),
      message: message?.trim(),
      messageType,
      fileUrl: fileData?.fileUrl || null,
      fileName: fileData?.fileName || null,
      fileSize: fileData?.fileSize || null,
      replyToId: replyToId || null,
    };

    console.log('📤 Sending message:', messageData);
    socket.emit('new message', messageData);
    return true;
  },

  // Listen for new messages
  onMessageReceived: (callback) => {
    if (!socket?.connected) return;
    socket.on('message received', callback);
    console.log('👂 Listening for messages');
  },

  offMessageReceived: () => {
    if (!socket) return;
    socket.off('message received');
  },

  // Typing indicators
  sendTyping: (chatId, userId) => {
    if (!socket?.connected) return false;
    socket.emit('typing', { chatId, userId });
    return true;
  },

  sendStopTyping: (chatId, userId) => {
    if (!socket?.connected) return false;
    socket.emit('stop typing', { chatId, userId });
    return true;
  },

  onUserTyping: (callback) => {
    if (!socket?.connected) return;
    socket.on('typing', callback);
    console.log('👂 Listening for typing events');
  },

  offUserTyping: () => {
    if (!socket) return;
    socket.off('typing');
  },

  onUserStopTyping: (callback) => {
    if (!socket?.connected) return;
    socket.on('stop typing', callback);
  },

  offUserStopTyping: () => {
    if (!socket) return;
    socket.off('stop typing');
  },

  // Read receipts - One-on-one
  markMessageAsRead: (messageId, userId) => {
    if (!socket?.connected) return false;
    socket.emit('mark as read', { messageId, userId });
    return true;
  },

  onMessageRead: (callback) => {
    if (!socket?.connected) return;
    socket.on('message read', callback);
  },

  offMessageRead: () => {
    if (!socket) return;
    socket.off('message read');
  },

  getMessageReadStatus: (messageId) => {
    if (!socket?.connected) return false;
    socket.emit('get message read status', messageId);
    return true;
  },

  onMessageReadStatus: (callback) => {
    if (!socket?.connected) return;
    socket.on('message read status', callback);
  },

  offMessageReadStatus: () => {
    if (!socket) return;
    socket.off('message read status');
  },

  // Read receipts - Group
  markMessageAsReadByUser: (messageId, userId) => {
    if (!socket?.connected) return false;
    socket.emit('mark as read by user', { messageId, userId });
    return true;
  },

  onMessageReadByUser: (callback) => {
    if (!socket?.connected) return;
    socket.on('message read by user', callback);
  },

  offMessageReadByUser: () => {
    if (!socket) return;
    socket.off('message read by user');
  },

  getGroupMessageReadStatus: (messageId) => {
    if (!socket?.connected) return false;
    socket.emit('get group message read status', messageId);
    return true;
  },

  onGroupMessageReadStatus: (callback) => {
    if (!socket?.connected) return;
    socket.on('group message read status', callback);
  },

  offGroupMessageReadStatus: () => {
    if (!socket) return;
    socket.off('group message read status');
  },

  // Online status
  onUserOnline: (callback) => {
    if (!socket?.connected) return;
    socket.on('user online', callback);
    console.log('👂 Listening for user online events');
  },

  offUserOnline: () => {
    if (!socket) return;
    socket.off('user online');
  },

  onUserOffline: (callback) => {
    if (!socket?.connected) return;
    socket.on('user offline', callback);
    console.log('👂 Listening for user offline events');
  },

  offUserOffline: () => {
    if (!socket) return;
    socket.off('user offline');
  },

  getUserOnlineStatus: (userId) => {
    if (!socket?.connected) return false;
    socket.emit('get user online status', userId);
    return true;
  },

  onUserOnlineStatus: (callback) => {
    if (!socket?.connected) return;
    socket.on('user online status', callback);
  },

  offUserOnlineStatus: () => {
    if (!socket) return;
    socket.off('user online status');
  },

  getOnlineUsersInChat: (chatId) => {
    if (!socket?.connected) return false;
    socket.emit('get online users in chat', chatId);
    return true;
  },

  onOnlineUsersInChat: (callback) => {
    if (!socket?.connected) return;
    socket.on('online users in chat', callback);
  },

  offOnlineUsersInChat: () => {
    if (!socket) return;
    socket.off('online users in chat');
  },

  // User viewing chat
  onUserViewingChat: (callback) => {
    if (!socket?.connected) return;
    socket.on('user viewing chat', callback);
  },

  offUserViewingChat: () => {
    if (!socket) return;
    socket.off('user viewing chat');
  },

  // Chat management
  clearChat: (chatId) => {
    if (!socket?.connected) return false;
    socket.emit('clear chat', chatId);
    return true;
  },

  onChatCleared: (callback) => {
    if (!socket?.connected) return;
    socket.on('chat cleared', callback);
  },

  offChatCleared: () => {
    if (!socket) return;
    socket.off('chat cleared');
  },

  deleteChat: (chat, authUserId) => {
    if (!socket?.connected) return false;
    socket.emit('delete chat', { chat, authUserId });
    return true;
  },

  onChatDeleted: (callback) => {
    if (!socket?.connected) return;
    socket.on('delete chat', callback);
  },

  offChatDeleted: () => {
    if (!socket) return;
    socket.off('delete chat');
  },

  notifyNewChat: (chat, authUserId) => {
    if (!socket?.connected) return false;
    socket.emit('chat created', { chat, authUserId });
    return true;
  },

  onChatCreated: (callback) => {
    if (!socket?.connected) return;
    socket.on('chat created', callback);
  },

  offChatCreated: () => {
    if (!socket) return;
    socket.off('chat created');
  },

  onRoomJoined: (callback) => {
    if (!socket?.connected) return;
    socket.on('joined room', callback);
  },

  offRoomJoined: () => {
    if (!socket) return;
    socket.off('joined room');
  },

  // Utility methods
  removeListener: (event) => {
    if (!socket) return;
    socket.off(event);
  },

  removeAllListeners: () => {
    if (!socket) return;
    socket.removeAllListeners();
  },

  // Cleanup method for component unmount
  cleanup: () => {
    if (!socket) return;
    
    const events = [
      'message received',
      'typing',
      'stop typing',
      'message read',
      'message read status',
      'message read by user',
      'group message read status',
      'user online',
      'user offline',
      'user online status',
      'online users in chat',
      'user viewing chat',
      'chat cleared',
      'delete chat',
      'chat created',
      'joined room',
    ];

    events.forEach(event => socket.off(event));
    console.log('🧹 Cleaned up socket listeners');
  },
};

export default socketService;