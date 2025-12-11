// components/MessageBubble.jsx
import React from 'react';
import { Reply, Check, CheckCheck } from 'lucide-react';

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

const MessageBubble = ({ message, isOwn, showAvatar, showSenderName, onReply, onScrollToReply }) => {
  return (
    <div
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
        {showAvatar && showSenderName && (
          <span className="text-xs text-gray-600 mb-1 px-2">{message.sender.name}</span>
        )}

        <div className="group relative">
          <div className={`rounded-2xl px-4 py-2 ${
            isOwn ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm'
          }`}>
            {message.replyTo && (
              <div 
                onClick={() => onScrollToReply(message.replyTo._id)}
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
            onClick={() => onReply(message)}
            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
            title="Reply"
          >
            <Reply className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;