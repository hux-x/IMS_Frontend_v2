import React from 'react';
import MessageBubble from '@/components/chats/MessageBubble';
import { mockUsers } from '@/components/utils/mockData';

const MessagesArea = ({ currentMessages, user, selectedChat, formatTime, messagesEndRef }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {currentMessages.map((message) => {
      const isOwn = message.senderId === user?.id;
      const sender = mockUsers.find(u => u.id === message.senderId);
      
      return (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={isOwn}
          sender={sender}
          selectedChat={selectedChat}
          formatTime={formatTime}
        />
      );
    })}
    <div ref={messagesEndRef} />
  </div>
);

export default MessagesArea;