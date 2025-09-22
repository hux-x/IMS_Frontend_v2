import React from 'react';

const MessageBubble = ({ message, isOwn, sender, selectedChat, formatTime }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        {!isOwn && selectedChat.type === 'group' && (
          <p className="text-xs text-gray-500 mb-1 px-3">
            {sender?.name || 'Unknown User'}
          </p>
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
      
      {!isOwn && (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2 mt-auto order-1">
          <span className="text-white text-xs">
            {sender?.name?.charAt(0) || '?'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;