import React, { useState, useEffect, useRef } from 'react';
import ChatListHeader from '@/components/chats/ChaListtHeader';
import ChatList from '@/components/chats/ChatList';
import ChatHeader from '@/components/chats/ChatHeader';
import MessagesArea from '@/components/chats/MessageArea';
import MessageInput from '@/components/chats/MessageInput';
import EmptyState from '@/components/chats/EmptyState';
import { useChat } from '@/context/ChatContext';

const Chat = () => {
  const {
    user,
    chats,
    messages,
    selectedChat,
    onlineUsers,
    loading,
    error,
    selectChat,
    sendMessage,
    loadMessages
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('direct');
  const [showMobile, setShowMobile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Get current user ID from context when user is loaded
  useEffect(() => {
    if (user && user._id) {
      setCurrentUserId(user._id);
    } else if (user && user.id) {
      setCurrentUserId(user.id);
    }
  }, [user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (selectedChat && messages[selectedChat._id]) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChat]);

  // Load more messages when scrolling to top
  const handleScroll = () => {
    if (messagesContainerRef.current && selectedChat) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const chatMessages = messages[selectedChat._id];
      
      // If scrolled to top and has more messages
      if (scrollTop === 0 && chatMessages?.hasMore && chatMessages.nextCursor) {
        loadMessages(selectedChat._id, chatMessages.nextCursor, 'before');
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedChat && currentUserId) {
      const tempId = sendMessage(selectedChat._id, messageInput.trim());
      
      // Optimistically add message to UI
      const optimisticMessage = {
        _id: tempId,
        sender: user || { _id: currentUserId, name: 'You' },
        content: messageInput.trim(),
        chat: selectedChat._id,
        createdAt: new Date().toISOString(), // Use ISO string format
        messageType: 'text',
        isOptimistic: true
      };

      // Note: In a real implementation, you might want to add this optimistic message
      // to the context state or handle it differently based on your UX preferences
      
      setMessageInput('');
    }
  };

  const getDirectChats = () => {
    return chats.filter(chat => !chat.isGroupChat);
  };

  const getGroupChats = () => {
    return chats.filter(chat => chat.isGroupChat);
  };

  const getCurrentMessages = () => {
    if (!selectedChat || !messages[selectedChat._id]) return [];
    return messages[selectedChat._id].messages || [];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      // Handle both ISO strings and Date objects
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', timestamp);
        return '';
      }
      
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false // Use 24-hour format for consistency
      });
    } catch (error) {
      console.error('Error formatting time:', error, timestamp);
      return '';
    }
  };

  const formatChatForList = (chat) => {
    if (!currentUserId) {
      // Return basic format if currentUserId is not available yet
      const chatName = chat.isGroupChat 
        ? chat.name 
        : chat.users?.find(u => u._id !== (user?._id || user?.id))?.name || 'Unknown User';

      return {
        id: chat._id,
        name: chatName,
        avatar: chat.isGroupChat ? chat.name?.charAt(0) || 'G' : null,
        type: chat.isGroupChat ? 'group' : 'direct',
        status: 'offline',
        lastMessage: chat.latestMessage,
        unreadCount: 0,
        memberCount: chat.isGroupChat ? chat.users?.length : undefined,
        color: chat.isGroupChat ? '#3b82f6' : undefined,
        updatedAt: chat.updatedAt
      };
    }

    const isOnline = chat.isGroupChat 
      ? chat.users?.some(userId => onlineUsers.includes(userId))
      : onlineUsers.includes(chat.users?.find(userId => userId !== currentUserId));

    const chatName = chat.isGroupChat 
      ? chat.name 
      : chat.users?.find(u => u._id !== currentUserId)?.name || 'Unknown User';

    const avatar = chat.isGroupChat 
      ? chat.name?.charAt(0) || 'G'
      : chat.users?.find(u => u._id !== currentUserId)?.avatar;

    return {
      id: chat._id,
      name: chatName,
      avatar: avatar,
      type: chat.isGroupChat ? 'group' : 'direct',
      status: isOnline ? 'online' : 'offline',
      lastMessage: chat.latestMessage,
      unreadCount: 0, // You can implement unread count logic
      memberCount: chat.isGroupChat ? chat.users?.length : undefined,
      color: chat.isGroupChat ? '#3b82f6' : undefined,
      updatedAt: chat.updatedAt
    };
  };

  // Helper function to determine if a message was sent by current user
  const isMessageFromCurrentUser = (message) => {
    if (!message || !message.sender) return false;
    
    const messageUserId = message.sender._id || message.sender.id;
    
    // Check against currentUserId from state
    if (currentUserId && messageUserId === currentUserId) {
      return true;
    }
    
    // Fallback to user from context
    if (user && (user._id || user.id)) {
      const contextUserId = user._id || user.id;
      if (messageUserId === contextUserId) {
        return true;
      }
    }
    
    // Debug log for troubleshooting
    if (process.env.NODE_ENV === 'development') {
      console.log('Message ownership check:', {
        messageUserId,
        currentUserId,
        contextUserId: user?._id || user?.id,
        isMatch: messageUserId === currentUserId || messageUserId === (user?._id || user?.id)
      });
    }
    
    return false;
  };

  const filteredChats = activeTab === 'direct' ? getDirectChats() : getGroupChats();
  const formattedChats = filteredChats.map(formatChatForList);
  const searchedChats = formattedChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = getCurrentMessages();

  // Show loading state
  if (loading && !user && !currentUserId) {
    return (
      <div className="h-[88vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-[88vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Connection Error</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[88vh] flex bg-white">
      {/* Chat List with Header */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${showMobile && selectedChat ? 'hidden md:flex' : ''}`}>
        <ChatListHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="flex-1 overflow-y-scroll overflow-x-hidden">
          <ChatList
            searchedChats={searchedChats}
            selectedChat={selectedChat ? formatChatForList(selectedChat) : null}
            setSelectedChat={(formattedChat) => {
              const originalChat = chats.find(c => c._id === formattedChat.id);
              selectChat(originalChat);
            }}
            setShowMobile={setShowMobile}
            showMobile={showMobile}
            searchTerm={searchTerm}
            formatTime={formatTime}
            onlineUsers={onlineUsers}
          />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : ''} ${showMobile && !selectedChat ? 'hidden' : ''}`}>
        {selectedChat ? (
          <>
            <ChatHeader 
              selectedChat={formatChatForList(selectedChat)} 
              setShowMobile={setShowMobile}
              onlineUsers={onlineUsers}
            />
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto"
            >
              <MessagesArea
                currentMessages={currentMessages}
                user={user || { _id: currentUserId, name: 'You' }}
                currentUserId={currentUserId} // Pass currentUserId explicitly
                selectedChat={formatChatForList(selectedChat)}
                formatTime={formatTime}
                messagesEndRef={messagesEndRef}
                loading={loading}
                hasMore={messages[selectedChat._id]?.hasMore}
                isMessageFromCurrentUser={isMessageFromCurrentUser} // Pass the helper function
              />
            </div>
            <MessageInput
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              handleSendMessage={handleSendMessage}
              disabled={!selectedChat || loading}
            />
          </>
        ) : (
          <EmptyState 
            onlineUsers={onlineUsers}
            totalChats={chats.length}
          />
        )}
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && currentUserId && (
        <div className="fixed top-4 right-4 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
          Current User: {currentUserId.substring(0, 8)}...
        </div>
      )}

      {/* Online Users Indicator */}
      {onlineUsers.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          {onlineUsers.length} online
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
          User ID: {currentUserId || 'Not found'}
        </div>
      )}
    </div>
  );
};

export default Chat;