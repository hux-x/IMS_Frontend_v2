// components/ChatWindow.jsx
import React, { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({
  selectedChat,
  messages,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  replyingTo,
  onReply,
  onCancelReply,
  typingUsers,
  onlineUsers,
  currentUser,
  sendingMessage,
  onShowGroupInfo,
  onLoadMoreMessages,
  loadingMoreMessages,
  hasMoreMessages
}) => {
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const previousMessagesLengthRef = useRef(0);
  const currentChatIdRef = useRef(null);
  const shouldScrollToBottomRef = useRef(true);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Smart scroll behavior for new messages
  useEffect(() => {
    if (!messageContainerRef.current) return;

    const container = messageContainerRef.current;
    const previousLength = previousMessagesLengthRef.current;
    const currentLength = messages.length;

    // Only handle new messages (added at the end), not loaded old messages
    if (currentLength > previousLength) {
      const messagesAdded = currentLength - previousLength;
      
      // Check if user is near bottom
      const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      const isNearBottom = scrollBottom < 150;
      
      // Auto-scroll if:
      // 1. User is near bottom
      // 2. It's a new chat being opened
      // 3. User sent the message (would be last message)
      const lastMessage = messages[messages.length - 1];
      const isSentByCurrentUser = lastMessage?.sender?._id === currentUser?._id;
      
      if (shouldScrollToBottomRef.current || isNearBottom || isSentByCurrentUser) {
        setTimeout(() => scrollToBottom(), 50);
        shouldScrollToBottomRef.current = false;
      } else {
        console.log('📍 User scrolled up, not auto-scrolling');
      }
    }

    previousMessagesLengthRef.current = currentLength;
  }, [messages.length, messages, currentUser]);

  // Handle chat change
  useEffect(() => {
    if (selectedChat?._id !== currentChatIdRef.current) {
      currentChatIdRef.current = selectedChat?._id;
      shouldScrollToBottomRef.current = true;
      previousMessagesLengthRef.current = messages.length;
      
      // Immediate scroll to bottom for new chats
      setTimeout(() => scrollToBottom('auto'), 0);
    }
  }, [selectedChat?._id, messages.length]);

  const getOtherUser = (chat) => {
    if (!chat || chat.isGroupChat) return null;
    if (!chat.users || !Array.isArray(chat.users)) return null;
    return chat.users.find(u => u && u._id && u._id !== currentUser?._id);
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

  const getTypingText = () => {
    if (!selectedChat) return '';
    
    const chatTypers = typingUsers.get(selectedChat._id);
    if (!chatTypers || chatTypers.size === 0) return '';
    
    if (selectedChat.isGroupChat) {
      const typingUserNames = selectedChat.users
        ?.filter(u => u && u._id && chatTypers.has(u._id) && u._id !== currentUser?._id)
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

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
        <MessageSquare className="w-20 h-20 mb-4 text-gray-300" />
        <h2 className="text-xl font-semibold mb-2">Welcome to Messages</h2>
        <p className="text-center max-w-md">
          Select a conversation from the sidebar or start a new chat to begin messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        chat={selectedChat}
        chatName={getChatName(selectedChat)}
        typingText={getTypingText()}
        isOnline={!selectedChat.isGroupChat && isUserOnline(getOtherUser(selectedChat)?._id)}
        onShowInfo={onShowGroupInfo}
      />

      <MessageList
        ref={messageContainerRef}
        messages={messages}
        currentUser={currentUser}
        selectedChat={selectedChat}
        onReply={onReply}
        typingText={getTypingText()}
        messagesEndRef={messagesEndRef}
        onLoadMore={onLoadMoreMessages}
        loadingMore={loadingMoreMessages}
        hasMore={hasMoreMessages}
      />

      <MessageInput
        value={messageInput}
        onChange={onMessageInputChange}
        onSend={onSendMessage}
        replyingTo={replyingTo}
        onCancelReply={onCancelReply}
        sending={sendingMessage}
        chatRepository={selectedChat?.Repository}
      />

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

export default ChatWindow;