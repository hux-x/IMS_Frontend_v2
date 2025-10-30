import React, { useState, useEffect, useRef, useContext } from 'react';
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
  MoreVertical,
  UserPlus,
  Loader2,
  Bell,
  Settings,
  Edit2,
  UserMinus,
  Trash2,
  Info
} from 'lucide-react';

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

// Group Info Modal Component
const GroupInfoModal = ({ isOpen, onClose, chat, currentUserId, allUsers, onUpdateGroup, onRemoveMember, onAddMember }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(chat?.chatName || '');
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (chat) {
      setGroupName(chat.chatName || '');
    }
  }, [chat]);

  if (!isOpen || !chat) return null;

  const isAdmin = chat.groupAdmin?._id === currentUserId;
  const availableUsers = allUsers.filter(u => 
    !chat.users.find(cu => cu._id === u._id) && u._id !== currentUserId
  ).filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleUpdateName = async () => {
    if (!groupName.trim() || groupName === chat.chatName) {
      setIsEditing(false);
      return;
    }

    setUpdating(true);
    try {
      await onUpdateGroup(chat._id, groupName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating group name:', error);
      alert('Failed to update group name');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddMember = async (userId) => {
    setUpdating(true);
    try {
      await onAddMember(chat._id, userId);
      setShowAddMember(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member from the group?')) return;
    
    setUpdating(true);
    try {
      await onRemoveMember(chat._id, userId);
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Group Info</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Group Avatar */}
        <div className="p-6 border-b border-gray-200 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white mb-3">
            <Users className="w-10 h-10" />
          </div>
          
          {/* Group Name */}
          {isEditing ? (
            <div className="flex items-center gap-2 w-full max-w-xs">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleUpdateName}
                disabled={updating}
                className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setGroupName(chat.chatName);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900">{chat.chatName}</h3>
              {isAdmin && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-1">
            {chat.users?.length || 0} members
          </p>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Members</h4>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              )}
            </div>

            {/* Add Member Section */}
            {showAddMember && isAdmin && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {availableUsers.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">No users found</p>
                  ) : (
                    availableUsers.map(user => (
                      <button
                        key={user._id}
                        onClick={() => handleAddMember(user._id)}
                        disabled={updating}
                        className="w-full flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-900">{user.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Current Members */}
            <div className="space-y-2">
              {chat.users?.map(member => {
                const isMemberAdmin = member._id === chat.groupAdmin?._id;
                const isCurrentUser = member._id === currentUserId;
                
                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.name} {isCurrentUser && '(You)'}
                        </p>
                        {isMemberAdmin && (
                          <p className="text-xs text-blue-600">Group Admin</p>
                        )}
                      </div>
                    </div>
                    
                    {isAdmin && !isCurrentUser && !isMemberAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={updating}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <UserMinus className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Group Chat Modal Component
const GroupChatModal = ({ isOpen, onClose, allUsers, currentUserId, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u._id === user._id);
      if (exists) {
        return prev.filter(u => u._id !== user._id);
      }
      return [...prev, user];
    });
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      alert('Please enter a group name and select at least 2 members');
      return;
    }

    setCreating(true);
    try {
      const userIds = selectedUsers.map(u => u._id);
      await onCreateGroup(groupName, userIds);
      
      setGroupName('');
      setSelectedUsers([]);
      setSearchQuery('');
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group chat');
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = allUsers
    .filter(u => u._id !== currentUserId)
    .filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Create Group Chat</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="px-4 pt-3 pb-2">
          <p className="text-sm text-gray-600">
            {selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''} selected
            {selectedUsers.length > 0 && <span className="text-gray-400"> (minimum 2 required)</span>}
          </p>
        </div>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users found</p>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map(user => {
                const isSelected = selectedUsers.find(u => u._id === user._id);
                return (
                  <button
                    key={user._id}
                    onClick={() => toggleUserSelection(user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedUsers.length < 2 || creating}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Group'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// New Chat Modal Component
const NewChatModal = ({ isOpen, onClose, allUsers, currentUserId, onStartChat, existingChats }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

  // Filter out users who already have a chat
  const availableUsers = allUsers
    .filter(u => u._id !== currentUserId)
    .filter(u => {
      // Check if one-on-one chat already exists
      const chatExists = existingChats.some(chat => 
        !chat.isGroupChat && chat.users?.some(cu => cu._id === u._id)
      );
      return !chatExists;
    })
    .filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[70vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Start New Chat</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {availableUsers.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {searchQuery ? 'No users found' : 'All users have existing chats'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {availableUsers.map(user => (
                <button
                  key={user._id}
                  onClick={() => {
                    onStartChat(user);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { userId, name, email } = useContext(AuthContext);
  const user = userId ? { _id: userId, name, email } : null;
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(new Map());
  const [notifications, setNotifications] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageContainerRef = useRef(null);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCx+zPLTgjMGHm7A7+OZUQ0PXKPQ7ahVFApGn+DyvmwhBCx+zPLTgjMGHm7A7+OZUw8P');
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Show notification
  const showNotification = (title, body, chatId) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/chat-icon.png',
        tag: chatId
      });
      
      notification.onclick = () => {
        window.focus();
        const chat = chats.find(c => c._id === chatId);
        if (chat) handleChatSelect(chat);
      };
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // Setup socket connection
  useEffect(() => {
    if (!userId) return;

    console.log('🔌 Initializing socket for user:', userId);
    socketRef.current = connectSocket(userId);

    const handleUserTyping = ({ userId: typingUserId }) => {
      if (typingUserId !== user?._id) {
        setTypingUsers(prev => new Set([...prev, typingUserId]));
      }
    };

    const handleUserStopTyping = ({ userId: typingUserId }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(typingUserId);
        return newSet;
      });
    };

    const handleUserOnline = ({ userId: onlineUserId }) => {
      setOnlineUsers(prev => new Set([...prev, onlineUserId]));
    };

    const handleUserOffline = ({ userId: offlineUserId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(offlineUserId);
        return newSet;
      });
    };

    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);
    socketService.onUserOnline(handleUserOnline);
    socketService.onUserOffline(handleUserOffline);

    loadInitialData();

    return () => {
      socketService.offUserTyping();
      socketService.offUserStopTyping();
      socketService.offUserOnline();
      socketService.offUserOffline();
      disconnectSocket();
    };
  }, [userId, user?._id]);

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load chats and users in parallel
      const [chatsResponse, usersResponse] = await Promise.all([
        chatService.getChats(0, 30),
        chatService.getAllUsers()
      ]);

      const chatsData = Array.isArray(chatsResponse.data) ? chatsResponse.data : chatsResponse.data?.data || [];
      setChats(chatsData);
      setAllUsers(usersResponse.data.employees || []);

      // Load first 30 messages for each chat
      const chatsWithMessages = await Promise.all(
        chatsData.slice(0, 10).map(async (chat) => {
          try {
            const response = await chatService.getChatWithMessages(chat._id, 30);
            let messagesData = [];
            if (response.data?.data?.messages && Array.isArray(response.data.data.messages)) {
              messagesData = response.data.data.messages;
            } else if (response.data?.messages && Array.isArray(response.data.messages)) {
              messagesData = response.data.messages;
            }
            
            // Count unread messages
            const unread = messagesData.filter(m => 
              m.sender._id !== user?._id && !m.isRead
            ).length;
            
            if (unread > 0) {
              setUnreadMessages(prev => new Map(prev).set(chat._id, unread));
            }
            
            return { ...chat, preloadedMessages: messagesData };
          } catch (error) {
            console.error('Error preloading messages for chat:', chat._id, error);
            return { ...chat, preloadedMessages: [] };
          }
        })
      );

      setInitialLoadComplete(true);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setChats([]);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Setup message listener
  useEffect(() => {
    if (!socketRef.current || !userId) return;

    const handleNewMessage = (message) => {
      console.log('💬 Message received:', message);
      
      // Update messages if it's for the currently selected chat
      if (selectedChat && message.chat === selectedChat._id) {
        setMessages(prev => {
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
        scrollToBottom();

        // Mark as read if not from current user
        if (message.sender._id !== user?._id) {
          socketService.markMessageAsRead(message._id, user._id);
        }
      } else {
        // Update unread count for other chats
        if (message.sender._id !== user?._id) {
          setUnreadMessages(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(message.chat) || 0;
            newMap.set(message.chat, current + 1);
            return newMap;
          });
          
          // Show notification
          playNotificationSound();
          showNotification(
            message.sender.name,
            message.message,
            message.chat
          );
        }
      }

      // Update chat list
      setChats(prev => {
        const chatExists = prev.some(c => c._id === message.chat);
        
        if (!chatExists) {
          const newChat = {
            _id: message.chat,
            latestMessage: message,
            users: [message.sender, user],
            isGroupChat: false,
            createdAt: message.createdAt
          };
          return [newChat, ...prev];
        }
        
        const updatedChats = prev.map(chat => 
          chat._id === message.chat 
            ? { ...chat, latestMessage: message }
            : chat
        );
        
        const chatIndex = updatedChats.findIndex(c => c._id === message.chat);
        if (chatIndex > 0) {
          const [updatedChat] = updatedChats.splice(chatIndex, 1);
          updatedChats.unshift(updatedChat);
        }
        
        return updatedChats;
      });
    };

    const handleMessageRead = ({ messageId }) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));
    };

    socketService.onMessageReceived(handleNewMessage);
    socketService.onMessageRead(handleMessageRead);

    return () => {
      socketService.offMessageReceived();
      socketService.offMessageRead();
    };
  }, [selectedChat, userId, user?._id]);

  // Join/leave chat rooms
  useEffect(() => {
    if (!selectedChat || !socketRef.current) return;

    socketService.joinChat(selectedChat._id);

    return () => {
      if (selectedChat) {
        socketService.leaveChat(selectedChat._id);
      }
    };
  }, [selectedChat]);

  // Handle chat selection
  const handleChatSelect = async (chat) => {
    if (selectedChat?._id === chat._id) return;

    setSelectedChat(chat);
    setLoading(true);

    try {
      // Clear unread count for this chat
      setUnreadMessages(prev => {
        const newMap = new Map(prev);
        newMap.delete(chat._id);
        return newMap;
      });

      // Use preloaded messages if available
      if (chat.preloadedMessages && chat.preloadedMessages.length > 0) {
        setMessages(chat.preloadedMessages);
        setLoading(false);
        scrollToBottom();
        return;
      }

      // Otherwise load messages
      const response = await chatService.getChatWithMessages(chat._id, 30);
      let messagesData = [];
      if (response.data?.data?.messages && Array.isArray(response.data.data.messages)) {
        messagesData = response.data.data.messages;
      } else if (response.data?.messages && Array.isArray(response.data.messages)) {
        messagesData = response.data.messages;
      }
      
      setMessages(messagesData);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send message
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
    setSendingMessage(false);
  };

  // Handle typing
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

  // Handle reply
  const handleReply = (message) => {
    setReplyingTo(message);
    document.getElementById('message-input')?.focus();
  };

  // Scroll to message
  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-message');
      setTimeout(() => element.classList.remove('highlight-message'), 2000);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Start new one-on-one chat
  const handleStartNewChat = async (selectedUser) => {
    try {
      const response = await chatService.postChat(selectedUser._id);
      const newChat = response.data.data || response.data;
      
      setChats(prev => [newChat, ...prev]);
      handleChatSelect(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  // Create group chat
  const handleCreateGroupChat = async (groupName, userIds) => {
    try {
      const response = await chatService.createGroup(groupName, userIds);
      const newChat = response.data.data || response.data;
      
      setChats(prev => [newChat, ...prev]);
      handleChatSelect(newChat);
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    }
  };

  // Update group name
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

  // Add member to group
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

  // Remove member from group
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

  // Get other user in one-on-one chat
  const getOtherUser = (chat) => {
    if (!chat || chat.isGroupChat) return null;
    if (!chat.users || !Array.isArray(chat.users)) return null;
    return chat.users.find(u => u && u._id && u._id !== user?._id);
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Get chat name
  const getChatName = (chat) => {
    if (!chat) return 'Unknown';
    if (chat.isGroupChat) return chat.chatName || 'Group Chat';
    const otherUser = getOtherUser(chat);
    return otherUser?.name || 'Unknown User';
  };

  // Filter chats
  const filteredChats = chats.filter(chat => {
    try {
      const chatName = getChatName(chat);
      if (!chatName) return false;
      return chatName.toLowerCase().includes(searchQuery.toLowerCase());
    } catch (error) {
      return false;
    }
  });

  // Get typing indicator text
  const getTypingText = () => {
    if (!selectedChat || typingUsers.size === 0) return '';
    
    if (selectedChat.isGroupChat) {
      const typingUserNames = selectedChat.users
        ?.filter(u => u && u._id && typingUsers.has(u._id) && u._id !== user?._id)
        .map(u => u.name)
        .slice(0, 2);
      
      if (!typingUserNames || typingUserNames.length === 0) return '';
      if (typingUserNames.length === 1) return `${typingUserNames[0]} is typing...`;
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      const otherUser = getOtherUser(selectedChat);
      if (!otherUser || !otherUser._id) return '';
      return typingUsers.has(otherUser._id) ? 'typing...' : '';
    }
  };

  // Check if message is unread
  const isMessageUnread = (chat) => {
    if (!chat.latestMessage) return false;
    return chat.latestMessage.sender?._id !== user?._id && !chat.latestMessage.isRead;
  };

  if (loading && !initialLoadComplete) {
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
      {/* Modals */}
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

      {/* Sidebar - Chat List */}
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
              const hasUnread = isMessageUnread(chat) || unreadCount > 0;

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
                        <h3 className={`${hasUnread ? 'font-bold' : 'font-semibold'} text-gray-900 truncate`}>
                          {getChatName(chat)}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {chat.latestMessage?.createdAt && formatTime(chat.latestMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
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

            {/* Messages Area */}
            <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
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
                  
                  {/* Typing Indicator */}
                  {typingUsers.size > 0 && getTypingText() && (
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
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>

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
    </div>
  );
};

export default ChatPage;