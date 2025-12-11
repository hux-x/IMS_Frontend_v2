// components/ChatHeader.jsx
import React from 'react';
import { Users, Info } from 'lucide-react';

const ChatHeader = ({ chat, chatName, typingText, isOnline, onShowInfo }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
          chat.isGroupChat ? 'bg-purple-500' : 'bg-blue-500'
        }`}>
          {chat.isGroupChat ? (
            <Users className="w-5 h-5" />
          ) : (
            chatName.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{chatName}</h2>
          <p className="text-xs text-gray-500">
            {typingText || (
              chat.isGroupChat 
                ? `${chat.users?.length || 0} members`
                : isOnline ? 'Online' : 'Offline'
            )}
          </p>
        </div>
      </div>
      {chat.isGroupChat && (
        <button 
          onClick={onShowInfo}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Group Info"
        >
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;