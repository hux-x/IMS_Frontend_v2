import React from 'react';
import ChatListItem from '@/components/chats/ChatListItem';

const ChatList = ({ 
  searchedChats, 
  selectedChat, 
  setSelectedChat, 
  setShowMobile, 
  showMobile, 
  searchTerm, 
  formatTime 
}) => (
  <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${showMobile && selectedChat ? 'hidden md:flex' : ''}`}>
    <div className="flex-1 overflow-y-scroll">
      {searchedChats.map((chat) => (
        <ChatListItem
          key={`${chat.type}-${chat.id}`}
          chat={chat}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setShowMobile={setShowMobile}
          formatTime={formatTime}
        />
      ))}
      
      {searchedChats.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ChatList;
