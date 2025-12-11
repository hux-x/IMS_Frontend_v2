import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/authContext';
import socketService, { connectSocket, disconnectSocket } from '@/apis/socket/config';
import chatService from '@/apis/services/chatService';
import { 
  MessageSquare, 
  Users, 
  Search, 
  Send, 
  Paperclip, 
  X, 
  Check, 
  CheckCheck,
  Reply,
  UserPlus,
  Loader2,
  Info,
  FolderOpen,
  FileText,
  Download
} from 'lucide-react';
import { ToastContainer } from '@/components/layout/Toast';
import GroupInfoModal from '@/components/modals/GroupChatModal';
import GroupChatModal from '@/components/modals/GroupChatModal';
import NewChatModal from '@/components/modals/NewChatModal';
import UploadFilesModal from '@/components/modals/UploadFileModal';
import UploadProgressToast from '@/components/ui/UploadProgressToast';

// Utility function for time formatting
const formatTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-2">
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, name, email, setUnread } = useContext(AuthContext);
  const user = userId ? { _id: userId, name, email } : null;

  const selectedChatIdFromState = location.state?.selectedChatId;

  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState(new Map());
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(new Map());
  const [toasts, setToasts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingClearTimeoutsRef = useRef(new Map());
  const messageContainerRef = useRef(null);
  const socketRef = useRef(null);
  const joinedChatsRef = useRef(new Set());
  const dataLoadedRef = useRef(false);

  const addToast = (message, sender, chatId) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, sender, chatId }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleToastClick = (chatId) => {
    const chat = chats.find(c => c._id === chatId);
    if (chat) {
      handleChatSelect(chat);
    }
  };

  // Only load data once on initial mount
  useEffect(() => {
    if (!userId || dataLoadedRef.current) return;

    console.log('🔌 Initializing socket for user:', userId);
    socketRef.current = connectSocket(userId);

    loadInitialData();
    dataLoadedRef.current = true;

    const requestOnlineStatusTimer = setTimeout(() => {
      console.log('🔍 Requesting online users after connection');
      allUsers.forEach(user => {
        if (user._id !== userId) {
          socketService.getUserOnlineStatus(user._id);
        }
      });
    }, 1000);

    return () => {
      clearTimeout(requestOnlineStatusTimer);
      typingClearTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      typingClearTimeoutsRef.current.clear();
      socketService.cleanup();
      disconnectSocket();
      dataLoadedRef.current = false;
    };
  }, [userId]);

  // Upload progress listener
  useEffect(() => {
    const handleShowProgress = (e) => {
      setUploadProgress(e.detail.files);
    };

    const handleUploadProgress = (e) => {
      setUploadProgress(prev => 
        prev.map(file => 
          file.uploadInfo.fileId === e.detail.fileId 
            ? { ...file, progress: e.detail.progress }
            : file
        )
      );
    };

    const handleUploadComplete = (e) => {
      if (e.detail.success) {
        setTimeout(() => setUploadProgress([]), 2000);
      } else {
        setUploadProgress([]);
      }
    };

    window.addEventListener('show-upload-progress', handleShowProgress);
    window.addEventListener('upload-progress', handleUploadProgress);
    window.addEventListener('upload-complete', handleUploadComplete);

    return () => {
      window.removeEventListener('show-upload-progress', handleShowProgress);
      window.removeEventListener('upload-progress', handleUploadProgress);
      window.removeEventListener('upload-complete', handleUploadComplete);
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [chatsResponse, usersResponse] = await Promise.all([
        chatService.getChats(0, 100),
        chatService.getAllUsers()
      ]);

      const chatsData = Array.isArray(chatsResponse.data) ? chatsResponse.data : chatsResponse.data?.data || [];
      setChats(chatsData);
      
      const usersData = usersResponse.data.employees || [];
      setAllUsers(usersData);

      const messagesMap = new Map();
      const unreadMap = new Map();

      await Promise.all(
        chatsData.map(async (chat) => {
          try {
            const response = await chatService.getChatWithMessages(chat._id, 100); 
            let messagesData = [];
            
            if (response.data?.data?.messages && Array.isArray(response.data.data.messages)) {
              messagesData = response.data.data.messages;
            } else if (response.data?.messages && Array.isArray(response.data.messages)) {
              messagesData = response.data.messages;
            }
            
            messagesMap.set(chat._id, messagesData);
            
            const unread = messagesData.filter(m => 
              m.sender._id !== user?._id && !m.isRead
            ).length;
            
            if (unread > 0) {
              unreadMap.set(chat._id, unread);
            }
          } catch (error) {
            console.error('Error loading messages for chat:', chat._id, error);
            messagesMap.set(chat._id, []);
          }
        })
      );

      setChatMessages(messagesMap);
      setUnreadMessages(unreadMap);
      const totalUnread = Array.from(unreadMap.values()).reduce((acc, val) => acc + val, 0);
      setUnread(totalUnread);
      
      setTimeout(() => {
        console.log('🔍 Requesting online status for', usersData.length, 'users');
        usersData.forEach(userData => {
          if (userData._id !== user?._id) {
            socketService.getUserOnlineStatus(userData._id);
          }
        });
      }, 1000);

      if (selectedChatIdFromState) {
        const chatToSelect = chatsData.find(c => c._id === selectedChatIdFromState);
        if (chatToSelect) {
          console.log('📍 Auto-selecting chat from notification:', selectedChatIdFromState);
          setTimeout(() => handleChatSelect(chatToSelect), 500);
        }
        window.history.replaceState({}, document.title);
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setChats([]);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socketRef.current || chats.length === 0) return;

    chats.forEach(chat => {
      if (!joinedChatsRef.current.has(chat._id)) {
        socketService.joinChat(chat._id);
        joinedChatsRef.current.add(chat._id);
        console.log('✅ Joined chat room:', chat._id);
      }
    });
  }, [chats]);

  useEffect(() => {
    if (!socketRef.current || !userId) return;

    const handleNewMessage = (message) => {
      console.log('💬 Message received:', message);
      
      let messageChatId;
      if (typeof message.chat === 'object' && message.chat !== null) {
        messageChatId = message.chat._id?.toString() || message.chat.toString();
      } else {
        messageChatId = message.chat?.toString();
      }
      
      const selectedChatId = selectedChat?._id?.toString();
      const isCurrentChat = selectedChatId && messageChatId === selectedChatId;
      
      setChatMessages(prev => {
        const newMap = new Map(prev);
        const chatMsgs = newMap.get(messageChatId) || [];
        
        const exists = chatMsgs.some(m => m._id === message._id);
        if (!exists) {
          newMap.set(messageChatId, [...chatMsgs, message]);
        }
        
        return newMap;
      });

      setChats(prev => {
        const chatIndex = prev.findIndex(c => c._id === messageChatId);
        if (chatIndex === -1) return prev;
        
        const updatedChats = [...prev];
        const chatToUpdate = { ...updatedChats[chatIndex] };
        chatToUpdate.latestMessage = message;
        
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(chatToUpdate);
        
        return updatedChats;
      });

      if (isCurrentChat) {
        setMessages(prev => {
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
        
        setTimeout(() => scrollToBottom(), 100);

        if (message.sender._id !== user?._id) {
          socketService.markMessageAsRead(message._id, user._id);
        }
      } else {
        if (message.sender._id !== user?._id) {
          console.log('📬 Incrementing unread count for chat:', messageChatId);
          
          setUnreadMessages(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(messageChatId) || 0;
            newMap.set(messageChatId, current + 1);
            
            const totalUnread = Array.from(newMap.values()).reduce((acc, val) => acc + val, 0);
            setUnread(totalUnread);
            
            return newMap;
          });
          
          addToast(message.message, message.sender.name, messageChatId);
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`New message from ${message.sender.name}`, {
              body: message.message,
              icon: '/logo.png',
              tag: messageChatId
            });
          }
          
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed:', e));
          } catch (error) {
            console.log('Notification sound error:', error);
          }
        }
      }
    };

    const handleUserTyping = ({ userId: typingUserId, chatId }) => {
      if (typingUserId !== user?._id) {
        console.log('⌨️ User typing:', typingUserId, 'in chat:', chatId);
        
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          const chatTypers = newMap.get(chatId) || new Set();
          chatTypers.add(typingUserId);
          newMap.set(chatId, chatTypers);
          return newMap;
        });
        
        const timeoutKey = `${chatId}-${typingUserId}`;
        if (typingClearTimeoutsRef.current.has(timeoutKey)) {
          clearTimeout(typingClearTimeoutsRef.current.get(timeoutKey));
        }
        
        const timeout = setTimeout(() => {
          console.log('⏱️ Clearing typing for user:', typingUserId);
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            const chatTypers = newMap.get(chatId);
            if (chatTypers) {
              chatTypers.delete(typingUserId);
              if (chatTypers.size === 0) {
                newMap.delete(chatId);
              } else {
                newMap.set(chatId, chatTypers);
              }
            }
            return newMap;
          });
          typingClearTimeoutsRef.current.delete(timeoutKey);
        }, 2000);
        
        typingClearTimeoutsRef.current.set(timeoutKey, timeout);
      }
    };

    const handleUserStopTyping = ({ userId: typingUserId, chatId }) => {
      console.log('🛑 User stopped typing:', typingUserId);
      
      const timeoutKey = `${chatId}-${typingUserId}`;
      if (typingClearTimeoutsRef.current.has(timeoutKey)) {
        clearTimeout(typingClearTimeoutsRef.current.get(timeoutKey));
        typingClearTimeoutsRef.current.delete(timeoutKey);
      }
      
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const chatTypers = newMap.get(chatId);
        if (chatTypers) {
          chatTypers.delete(typingUserId);
          if (chatTypers.size === 0) {
            newMap.delete(chatId);
          } else {
            newMap.set(chatId, chatTypers);
          }
        }
        return newMap;
      });
    };

    const handleInitialOnlineUsers = ({ users }) => {
      console.log('👥 Received initial online users:', users.length);
      setOnlineUsers(new Set(users));
    };

    const handleUserOnline = ({ userId: onlineUserId }) => {
      console.log('✅ User came online:', onlineUserId);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.add(onlineUserId);
        return newSet;
      });
    };

    const handleUserOffline = ({ userId: offlineUserId }) => {
      console.log('❌ User went offline:', offlineUserId);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(offlineUserId);
        return newSet;
      });
    };

    const handleUserOnlineStatus = ({ userId: statusUserId, isOnline }) => {
      console.log(`🔍 User status: ${statusUserId} is ${isOnline ? 'online' : 'offline'}`);
      if (isOnline) {
        setOnlineUsers(prev => new Set([...prev, statusUserId]));
      } else {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(statusUserId);
          return newSet;
        });
      }
    };

    const handleMessageRead = ({ messageId }) => {
      console.log('✅ Message read:', messageId);
      setChatMessages(prev => {
        const newMap = new Map(prev);
        for (const [chatId, msgs] of newMap.entries()) {
          const updated = msgs.map(m => 
            m._id === messageId ? { ...m, isRead: true } : m
          );
          newMap.set(chatId, updated);
        }
        return newMap;
      });

      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));
    };

    socketService.onMessageReceived(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);
    socketService.onUserOnline(handleUserOnline);
    socketService.onUserOffline(handleUserOffline);
    socketService.onMessageRead(handleMessageRead);

    if (socketRef.current) {
      socketRef.current.on('initial online users', handleInitialOnlineUsers);
      socketRef.current.on('user online status', handleUserOnlineStatus);
    }

    return () => {
      socketService.offMessageReceived();
      socketService.offUserTyping();
      socketService.offUserStopTyping();
      socketService.offUserOnline();
      socketService.offUserOffline();
      socketService.offMessageRead();
      
      if (socketRef.current) {
        socketRef.current.off('initial online users', handleInitialOnlineUsers);
        socketRef.current.off('user online status', handleUserOnlineStatus);
      }
    };
  }, [selectedChat, userId, user, chats]);

  const handleChatSelect = async (chat) => {
    if (selectedChat?._id === chat._id) return;

    setSelectedChat(chat);

    setUnreadMessages(prev => {
      const newMap = new Map(prev);
      const unreadCount = newMap.get(chat._id) || 0;
      newMap.delete(chat._id);
      
      const totalUnread = Array.from(newMap.values()).reduce((acc, val) => acc + val, 0);
      setUnread(totalUnread);
      
      return newMap;
    });

    const cachedMessages = chatMessages.get(chat._id) || [];
    setMessages(cachedMessages);
    
    cachedMessages.forEach(msg => {
      if (msg.sender._id !== user?._id && !msg.isRead) {
        console.log('✅ Marking message as read on chat open:', msg._id);
        socketService.markMessageAsRead(msg._id, user._id);
      }
    });

    setTimeout(() => scrollToBottom(), 100);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || sendingMessage) return;

    setSendingMessage(true);
    
    socketService.sendMessage(
      selectedChat._id,
      user._id,
      messageInput,
      'text',
      null,
      replyingTo?._id
    );

    setMessageInput('');
    setReplyingTo(null);
    socketService.sendStopTyping(selectedChat._id, user._id);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setSendingMessage(false);
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    if (!selectedChat) return;

    socketService.sendTyping(selectedChat._id, user._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendStopTyping(selectedChat._id, user._id);
    }, 1000);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    document.getElementById('message-input')?.focus();
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-message');
      setTimeout(() => element.classList.remove('highlight-message'), 2000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartNewChat = async (selectedUser) => {
    try {
      const response = await chatService.postChat(selectedUser._id);
      const newChat = response.data.data || response.data;
      
      setChats(prev => [newChat, ...prev]);
      setChatMessages(prev => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, []);
        return newMap;
      });
      
      socketService.joinChat(newChat._id);
      joinedChatsRef.current.add(newChat._id);
      
      handleChatSelect(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleCreateGroupChat = async (groupName, userIds) => {
    try {
      const response = await chatService.createGroup(groupName, userIds);
      const newChat = response.data.data || response.data;
      
      setChats(prev => [newChat, ...prev]);
      setChatMessages(prev => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, []);
        return newMap;
      });
      
      socketService.joinChat(newChat._id);
      joinedChatsRef.current.add(newChat._id);
      
      handleChatSelect(newChat);
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    }
  };

  const handleUpdateGroup = async (chatId, newName) => {
    try {
      const response = await chatService.renameGroup(chatId, newName);
      const updatedChat = response.data.data || response.data;
      
      setChats(prev => prev.map(c => c._id === chatId ? updatedChat : c));
      if (selectedChat?._id === chatId) {
        setSelectedChat(updatedChat);
      }
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  };

  const handleAddMember = async (chatId, userId) => {
    try {
      const response = await chatService.addToGroup(chatId, userId);
      const updatedChat = response.data.data || response.data;
      
      setChats(prev => prev.map(c => c._id === chatId ? updatedChat : c));
      if (selectedChat?._id === chatId) {
        setSelectedChat(updatedChat);
      }
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const handleRemoveMember = async (chatId, userId) => {
    try {
      const response = await chatService.removeFromGroup(chatId, userId);
      const updatedChat = response.data.data || response.data;
      
      setChats(prev => prev.map(c => c._id === chatId ? updatedChat : c));
      if (selectedChat?._id === chatId) {
        setSelectedChat(updatedChat);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  };

  const getOtherUser = (chat) => {
    if (!chat || chat.isGroupChat) return null;
    if (!chat.users || !Array.isArray(chat.users)) return null;
    return chat.users.find(u => u && u._id && u._id !== user?._id);
  };

  const isUserOnline = (userId) => {
    return userId ? onlineUsers.has(userId) : false;
  };

  const getChatName = (chat) => {
    if (!chat) return 'Unknown';
    if (chat.isGroupChat) return chat.chatName || 'Group Chat';
    const otherUser = getOtherUser(chat);
    return otherUser?.name || 'Unknown User';
  };

  const filteredChats = chats.filter(chat => {
    try {
      const chatName = getChatName(chat);
      if (!chatName) return false;
      return chatName.toLowerCase().includes(searchQuery.toLowerCase());
    } catch (error) {
      return false;
    }
  });

  const getTypingText = () => {
    if (!selectedChat) return '';
    
    const chatTypers = typingUsers.get(selectedChat._id);
    if (!chatTypers || chatTypers.size === 0) return '';
    
    if (selectedChat.isGroupChat) {
      const typingUserNames = selectedChat.users
        ?.filter(u => u && u._id && chatTypers.has(u._id) && u._id !== user?._id)
        .map(u => u.name)
        .slice(0, 2);
      
      if (!typingUserNames || typingUserNames.length === 0) return '';
      if (typingUserNames.length === 1) return `${typingUserNames[0]} is typing...`;
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      const otherUser = getOtherUser(selectedChat);
      if (!otherUser || !otherUser._id) return '';
      return chatTypers.has(otherUser._id) ? 'typing...' : '';
    }
  };

  const handleOpenRepository = () => {
    if (selectedChat?.Repository?._id) {
      navigate(`/files/${selectedChat.Repository._id}`);
    }
  };

  const handleFileMessageClick = () => {
    handleOpenRepository();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <GroupChatModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        allUsers={allUsers}
        currentUserId={user?._id}
        onCreateGroup={handleCreateGroupChat}
      />

      <NewChatModal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        allUsers={allUsers}
        currentUserId={user?._id}
        onStartChat={handleStartNewChat}
        existingChats={chats}
      />

      {showUploadModal && selectedChat && (
        <UploadFilesModal
          onClose={() => setShowUploadModal(false)}
          repoId={selectedChat.Repository._id}
          chatId={selectedChat._id}
          userId={user._id}
          onUploadComplete={() => {
            console.log('Files uploaded successfully');
            setShowUploadModal(false);
          }}
        />
      )}

      <GroupInfoModal
        isOpen={showGroupInfo}
        onClose={() => setShowGroupInfo(false)}
        chat={selectedChat}
        currentUserId={user?._id}
        allUsers={allUsers}
        onUpdateGroup={handleUpdateGroup}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      {uploadProgress.length > 0 && (
        <UploadProgressToast files={uploadProgress} />
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewChat(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="New Chat"
              >
                <UserPlus className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowGroupModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="New Group Chat"
              >
                <Users className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-12 h-12 mb-2 text-gray-300" />
              <p className="text-sm">No chats yet</p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const otherUser = getOtherUser(chat);
              const isOnline = otherUser && isUserOnline(otherUser._id);
              const isSelected = selectedChat?._id === chat._id;
              const unreadCount = unreadMessages.get(chat._id) || 0;

              return (
                <button
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        chat.isGroupChat ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {chat.isGroupChat ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          getChatName(chat).charAt(0).toUpperCase()
                        )}
                      </div>
                      {isOnline && !chat.isGroupChat && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className={`${unreadCount > 0 ? 'font-bold' : 'font-semibold'} text-gray-900 truncate`}>
                          {getChatName(chat)}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {chat.latestMessage?.createdAt && formatTime(chat.latestMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {chat.latestMessage?.message || 'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  selectedChat.isGroupChat ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {selectedChat.isGroupChat ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    getChatName(selectedChat).charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{getChatName(selectedChat)}</h2>
                  <p className="text-xs text-gray-500">
                    {getTypingText() || (
                      selectedChat.isGroupChat 
                        ? `${selectedChat.users?.length || 0} members`
                        : isUserOnline(getOtherUser(selectedChat)?._id) ? 'Online' : 'Offline'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedChat.Repository && (
                  <button 
                    onClick={handleOpenRepository}
                    className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                    title="Open Repository Files"
                  >
                    <FolderOpen className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Files</span>
                  </button>
                )}
                {selectedChat.isGroupChat && (
                  <button 
                    onClick={() => setShowGroupInfo(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Group Info"
                  >
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isOwn = message.sender._id === user?._id;
                    const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;

                    return (
                      <div
                        key={message._id}
                        id={`message-${message._id}`}
                        className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''} transition-all duration-300`}
                      >
                        <div className="flex-shrink-0">
                          {showAvatar ? (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                              {message.sender.name?.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <div className="w-8 h-8"></div>
                          )}
                        </div>

                        <div className={`flex flex-col max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
                          {showAvatar && !isOwn && selectedChat.isGroupChat && (
                            <span className="text-xs text-gray-600 mb-1 px-2">{message.sender.name}</span>
                          )}

                          <div className="group relative">
                            {message.messageType === 'file' ? (
                              <div 
                                onClick={handleFileMessageClick}
                                className={`rounded-2xl px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity ${
                                  isOwn ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className={`w-8 h-8 ${isOwn ? 'text-blue-100' : 'text-blue-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                                      {message.fileMetadata?.fileName || 'File'}
                                    </p>
                                    <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                      {message.fileMetadata?.size ? formatFileSize(message.fileMetadata.size) : 'Unknown size'}
                                    </p>
                                  </div>
                                  <Download className={`w-5 h-5 flex-shrink-0 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`} />
                                </div>

                                <div className={`flex items-center gap-1 mt-2 text-xs ${
                                  isOwn ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  <span>{formatTime(message.createdAt)}</span>
                                  {isOwn && (
                                    message.isRead ? (
                                      <CheckCheck className="w-4 h-4" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className={`rounded-2xl px-4 py-2 ${
                                isOwn ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm'
                              }`}>
                                {message.replyTo && (
                                  <div 
                                    onClick={() => scrollToMessage(message.replyTo._id)}
                                    className={`mb-2 pb-2 border-l-2 pl-2 cursor-pointer ${
                                      isOwn ? 'border-blue-300' : 'border-gray-300'
                                    }`}
                                  >
                                    <p className={`text-xs font-semibold ${isOwn ? 'text-blue-100' : 'text-blue-600'}`}>
                                      {message.replyTo.sender?.name}
                                    </p>
                                    <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-600'} truncate`}>
                                      {message.replyTo.message}
                                    </p>
                                  </div>
                                )}

                                <p className="break-words">{message.message}</p>

                                <div className={`flex items-center gap-1 mt-1 text-xs ${
                                  isOwn ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  <span>{formatTime(message.createdAt)}</span>
                                  {isOwn && (
                                    message.isRead ? (
                                      <CheckCheck className="w-4 h-4" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => handleReply(message)}
                              className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                              title="Reply"
                            >
                              <Reply className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {getTypingText() && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8"></div>
                      <TypingIndicator />
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              {replyingTo && (
                <div className="mb-3 bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Reply className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Replying to {replyingTo.sender.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{replyingTo.message}</p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                {selectedChat.Repository && (
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Upload Files"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                )}

                <div className="flex-1 relative">
                  <textarea
                    id="message-input"
                    value={messageInput}
                    onChange={handleTyping}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="1"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendingMessage}
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingMessage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-20 h-20 mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">Welcome to Messages</h2>
            <p className="text-center max-w-md">
              Select a conversation from the sidebar or start a new chat to begin messaging
            </p>
          </div>
        )}
      </div>

      <style>{`
        .highlight-message {
          animation: highlight 2s ease;
        }

        @keyframes highlight {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(59, 130, 246, 0.1); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <ToastContainer toasts={toasts} removeToast={removeToast} onToastClick={handleToastClick} />
    </div>
  );
};

export default ChatPage;