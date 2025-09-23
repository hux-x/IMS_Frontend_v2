import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import client from '@/apis/apiClient/client';
import { AuthContext } from './authContext';

// Chat Context
const ChatContext = createContext();

// Action Types
const CHAT_ACTIONS = {
  SET_SOCKET: 'SET_SOCKET',
  SET_USER: 'SET_USER',
  SET_CHATS: 'SET_CHATS',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_SELECTED_CHAT: 'SET_SELECTED_CHAT',
  SET_ONLINE_USERS: 'SET_ONLINE_USERS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_MESSAGE_STATUS: 'UPDATE_MESSAGE_STATUS',
  MARK_MESSAGES_READ: 'MARK_MESSAGES_READ',
  SET_TYPING: 'SET_TYPING',
  UPDATE_CHAT: 'UPDATE_CHAT',
  RESET_STATE: 'RESET_STATE'
};

// Initial State
const initialState = {
  socket: null,
  user: null,
  chats: [],
  messages: {}, // { chatId: { messages: [], hasMore: boolean, nextCursor: string } }
  selectedChat: null,
  onlineUsers: [],
  loading: false,
  error: null,
  typingUsers: {}, // { chatId: [userIds] }
  messageStatus: {} // { tempId: { status: 'sending'|'sent'|'failed' } }
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.SET_SOCKET:
      return { ...state, socket: action.payload };
    
    case CHAT_ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    
    case CHAT_ACTIONS.SET_CHATS:
      return { ...state, chats: action.payload };
    
    case CHAT_ACTIONS.SET_MESSAGES:
      const { chatId, messages, hasMore, nextCursor, direction } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: {
            messages: direction === 'before' 
              ? [...messages, ...(state.messages[chatId]?.messages || [])]
              : [...(state.messages[chatId]?.messages || []), ...messages],
            hasMore,
            nextCursor
          }
        }
      };
    
    case CHAT_ACTIONS.ADD_MESSAGE:
      const { message, chatId: msgChatId } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [msgChatId]: {
            ...state.messages[msgChatId],
            messages: [...(state.messages[msgChatId]?.messages || []), message]
          }
        }
      };
    
    case CHAT_ACTIONS.SET_SELECTED_CHAT:
      return { ...state, selectedChat: action.payload };
    
    case CHAT_ACTIONS.SET_ONLINE_USERS:
      return { ...state, onlineUsers: action.payload };
    
    case CHAT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CHAT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    case CHAT_ACTIONS.UPDATE_MESSAGE_STATUS:
      const { tempId, status, messageId } = action.payload;
      return {
        ...state,
        messageStatus: {
          ...state.messageStatus,
          [tempId]: { status, messageId }
        }
      };
    
    case CHAT_ACTIONS.MARK_MESSAGES_READ:
      const { chatId: readChatId, messageIds } = action.payload;
      const chatMessages = state.messages[readChatId]?.messages || [];
      const updatedMessages = chatMessages.map(msg => 
        messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
      );
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [readChatId]: {
            ...state.messages[readChatId],
            messages: updatedMessages
          }
        }
      };
    
    case CHAT_ACTIONS.SET_TYPING:
      const { chatId: typingChatId, userId, isTyping } = action.payload;
      const currentTyping = state.typingUsers[typingChatId] || [];
      
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [typingChatId]: isTyping
            ? [...currentTyping.filter(id => id !== userId), userId]
            : currentTyping.filter(id => id !== userId)
        }
      };
    
    case CHAT_ACTIONS.UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats.map(chat => 
          chat._id === action.payload._id ? { ...chat, ...action.payload } : chat
        )
      };
    
    case CHAT_ACTIONS.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Provider Component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const socketRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);
  const typingTimeoutRef = useRef({});
  const isInitializedRef = useRef(false);

  // Initialize Socket Connection
  const initializeSocket = async () => {
    try {
      // Get auth token from your auth system
      const token = localStorage.getItem('auth_token') || client.defaults.headers.common['Authorization']?.replace('Bearer ', '');
      
      if (!token) {
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Authentication required' });
        return;
      }

      const socket = io('35.173.56.214:5000', {
        auth: { token }
      });

      socketRef.current = socket;
      dispatch({ type: CHAT_ACTIONS.SET_SOCKET, payload: socket });

      // Socket event listeners
      socket.on('connect', () => {
        console.log('Connected to server');
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: null });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socket.on('registered', (data) => {
        console.log('User registered:', data);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: error.message });
      });

      socket.on('online_users', (users) => {
        dispatch({ type: CHAT_ACTIONS.SET_ONLINE_USERS, payload: users });
      });

      socket.on('messages_loaded', (data) => {
        dispatch({ 
          type: CHAT_ACTIONS.SET_MESSAGES, 
          payload: {
            chatId: data.chatId,
            messages: data.messages,
            hasMore: data.hasMore,
            nextCursor: data.nextCursor,
            direction: data.direction
          }
        });
      });

      socket.on('new_message', (data) => {
        dispatch({ 
          type: CHAT_ACTIONS.ADD_MESSAGE, 
          payload: { 
            message: data.message, 
            chatId: data.message.chat 
          }
        });

        // Update chat's last message
        dispatch({
          type: CHAT_ACTIONS.UPDATE_CHAT,
          payload: {
            _id: data.message.chat,
            latestMessage: data.message,
            updatedAt: new Date()
          }
        });
      });

      socket.on('message_sent', (data) => {
        dispatch({
          type: CHAT_ACTIONS.UPDATE_MESSAGE_STATUS,
          payload: {
            tempId: data.tempId,
            status: data.success ? 'sent' : 'failed',
            messageId: data.messageId
          }
        });
      });

      socket.on('messages_read', (data) => {
        dispatch({
          type: CHAT_ACTIONS.MARK_MESSAGES_READ,
          payload: {
            chatId: data.chatId,
            messageIds: data.messageIds
          }
        });
      });

    } catch (error) {
      console.error('Socket initialization error:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Connection failed' });
    }
  };

  // Cleanup socket connection
  const cleanupSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      dispatch({ type: CHAT_ACTIONS.SET_SOCKET, payload: null });
    }
    
    // Clear typing timeouts
    Object.values(typingTimeoutRef.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    typingTimeoutRef.current = {};
    
    // Reset state
    dispatch({ type: CHAT_ACTIONS.RESET_STATE });
    isInitializedRef.current = false;
  };

  // Load User and Chats
  const loadUserData = async () => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      
      // Get user ID from token (decode JWT to get user info)
      const token = localStorage.getItem('auth_token') || client.defaults.headers.common['Authorization']?.replace('Bearer ', '');
      
      if (token) {
        try {
          // Decode JWT token to get user info (simple decode, not verification)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decoded = JSON.parse(jsonPayload);
          const user = {
            _id: decoded.id,
            id: decoded.id,
            name: decoded.name || 'User',
            email: decoded.email
          };
          
          dispatch({ type: CHAT_ACTIONS.SET_USER, payload: user });

          // Register socket with user ID
          if (socketRef.current) {
            socketRef.current.emit('register', user._id || user.id);
          }
        } catch (tokenError) {
          console.error('Error decoding token:', tokenError);
          dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Invalid authentication token' });
          return;
        }
      } else {
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Authentication token not found' });
        return;
      }

      // Load user's chats (combine private and team chats)
      const [privateChatsResponse, teamChatsResponse] = await Promise.all([
        client.get('/chats/private'),
        client.get('/chats/team')
      ]);
      
      const allChats = [
        ...privateChatsResponse.data,
        ...teamChatsResponse.data
      ];
      
      dispatch({ type: CHAT_ACTIONS.SET_CHATS, payload: allChats });

    } catch (error) {
      console.error('Error loading user data:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to load user data' });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Load Messages for a Chat
  const loadMessages = (chatId, cursor = null, direction = 'before') => {
    if (socketRef.current) {
      socketRef.current.emit('load_messages', {
        chatId,
        cursor,
        limit: 20,
        direction
      });
    }
  };

  // Send Message
  const sendMessage = (chatId, content, messageType = 'text', replyTo = null) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    
    if (socketRef.current) {
      // Update status to sending
      dispatch({
        type: CHAT_ACTIONS.UPDATE_MESSAGE_STATUS,
        payload: { tempId, status: 'sending' }
      });

      // Send message
      socketRef.current.emit('send_message', {
        chatId,
        content,
        messageType,
        replyTo,
        tempId
      });
    }
    
    return tempId;
  };

  // Select Chat
  const selectChat = (chat) => {
    dispatch({ type: CHAT_ACTIONS.SET_SELECTED_CHAT, payload: chat });
    
    // Load messages for selected chat
    if (chat && !state.messages[chat._id]) {
      loadMessages(chat._id);
    }
  };

  // Create New Chat
  const createChat = async (userIds, isGroupChat = false, name = null) => {
    try {
      const endpoint = isGroupChat ? '/chats/team' : '/chats/private';
      const payload = isGroupChat 
        ? { userIds, name }
        : { userId: userIds[0] }; // For private chat, send single userId
      
      const response = await client.post(endpoint, payload);
      
      const newChat = response.data;
      dispatch({ 
        type: CHAT_ACTIONS.SET_CHATS, 
        payload: [...state.chats, newChat] 
      });
      
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to create chat' });
    }
  };

  // Effect to handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && !isInitializedRef.current) {
      // User is authenticated and chat hasn't been initialized yet
      initializeSocket();
      loadUserData();
      isInitializedRef.current = true;
    } else if (!isAuthenticated && isInitializedRef.current) {
      // User is no longer authenticated, cleanup
      cleanupSocket();
    }
  }, [isAuthenticated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSocket();
    };
  }, []);

  // Additional helper functions for chat management
  const getUsersForChat = async () => {
    try {
      const response = await client.get('/chats/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const addUsersToGroupChat = async (chatId, userIds) => {
    try {
      const response = await client.put(`/chats/team/${chatId}/users`, { userIds });
      
      // Update the chat in state
      dispatch({
        type: CHAT_ACTIONS.UPDATE_CHAT,
        payload: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding users to group chat:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to add users to chat' });
    }
  };

  const removeUserFromGroupChat = async (chatId, userId) => {
    try {
      const response = await client.delete(`/chats/team/${chatId}/users`, { 
        data: { userId } 
      });
      
      // Update the chat in state
      dispatch({
        type: CHAT_ACTIONS.UPDATE_CHAT,
        payload: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error removing user from group chat:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to remove user from chat' });
    }
  };

  const markChatAsRead = async (chatId) => {
    try {
      await client.put(`/chats/${chatId}/read`);
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  // Only provide chat functionality if user is authenticated
  const value = isAuthenticated ? {
    ...state,
    loadMessages,
    sendMessage,
    selectChat,
    createChat,
    initializeSocket,
    getUsersForChat,
    addUsersToGroupChat,
    removeUserFromGroupChat,
    markChatAsRead
  } : {
    ...initialState,
    // Provide stub functions for unauthenticated users
    loadMessages: () => console.warn('User not authenticated'),
    sendMessage: () => console.warn('User not authenticated'),
    selectChat: () => console.warn('User not authenticated'),
    createChat: () => console.warn('User not authenticated'),
    initializeSocket: () => console.warn('User not authenticated'),
    getUsersForChat: () => console.warn('User not authenticated'),
    addUsersToGroupChat: () => console.warn('User not authenticated'),
    removeUserFromGroupChat: () => console.warn('User not authenticated'),
    markChatAsRead: () => console.warn('User not authenticated')
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom Hook
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};