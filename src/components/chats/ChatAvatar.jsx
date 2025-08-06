import React from 'react';

const ChatAvatar = ({ chat, showStatus = false }) => (
  <div className="relative">
    {chat.type === 'direct' ? (
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
        <span className="text-white font-semibold">
          {chat.name.charAt(0)}
        </span>
      </div>
    ) : (
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: chat.color }}
      >
        <span className="text-white font-semibold">
          {chat.avatar}
        </span>
      </div>
    )}
    
    {showStatus && chat.type === 'direct' && (
      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
        chat.status === 'online' ? 'bg-green-500' :
        chat.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
      }`}></div>
    )}
  </div>
);

export default ChatAvatar;