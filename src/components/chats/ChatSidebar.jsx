// components/ChatSidebar.jsx
import React from 'react';
import { MessageSquare, Users, Search, UserPlus } from 'lucide-react';
import ChatListItem from './ChatListItem';

const ChatSidebar = ({
  chats,
  selectedChat,
  onChatSelect,
  searchQuery,
  setSearchQuery,
  onlineUsers,
  unreadMessages,
  currentUserId,
  onNewChat,
  onNewGroup
}) => {
  const getOtherUser = (chat) => {
    if (!chat || chat.isGroupChat) return null;
    if (!chat.users || !Array.isArray(chat.users)) return null;
    return chat.users.find(u => u && u._id && u._id !== currentUserId);
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

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          <div className="flex gap-2">
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="New Chat"
            >
              <UserPlus className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onNewGroup}
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
          filteredChats.map(chat => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              isSelected={selectedChat?._id === chat._id}
              onSelect={() => onChatSelect(chat)}
              isOnline={!chat.isGroupChat && onlineUsers.has(getOtherUser(chat)?._id)}
              unreadCount={unreadMessages.get(chat._id) || 0}
              chatName={getChatName(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;