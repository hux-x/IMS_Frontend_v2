// components/ChatListItem.jsx
import React from 'react';
import { Users } from 'lucide-react';

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

const ChatListItem = ({ chat, isSelected, onSelect, isOnline, unreadCount, chatName }) => {
  return (
    <button
      onClick={onSelect}
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
              chatName.charAt(0).toUpperCase()
            )}
          </div>
          {isOnline && !chat.isGroupChat && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className={`${unreadCount > 0 ? 'font-bold' : 'font-semibold'} text-gray-900 truncate`}>
              {chatName}
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
};

export default ChatListItem;