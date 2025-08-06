import React from 'react';
import { Users } from 'lucide-react';
import ChatAvatar from './ChatAvatar';
import Badge from '@/components/custom/Badge';

const ChatListItem = ({ chat, selectedChat, setSelectedChat, setShowMobile, formatTime }) => (
  <div
    onClick={() => {
      setSelectedChat(chat);
      setShowMobile(true);
    }}
    className={`p-4 cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 ${
      selectedChat?.id === chat.id && selectedChat?.type === chat.type
        ? 'bg-green-50 border-l-4 border-l-green-500'
        : ''
    }`}
  >
    <div className="flex items-center space-x-3">
      <ChatAvatar chat={chat} showStatus={true} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
          {chat.unreadCount > 0 && (
            <Badge className="bg-green-500 text-white">
              {chat.unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">
            {chat.lastMessage?.content || 'No messages yet'}
          </p>
          {chat.lastMessage && (
            <span className="text-xs text-gray-500">
              {formatTime(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        
        {chat.type === 'group' && (
          <div className="flex items-center space-x-1 mt-1">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {chat.memberCount} members
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ChatListItem;