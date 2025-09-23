import React from 'react';
import MessageBubble from '@/components/chats/MessageBubble';

const MessagesArea = ({ 
  currentMessages, 
  user, 
  currentUserId, 
  selectedChat, 
  formatTime, 
  messagesEndRef,
  isMessageFromCurrentUser 
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {currentMessages.map((message) => {
        // Use the helper function passed from parent
        const isOwn = isMessageFromCurrentUser ? isMessageFromCurrentUser(message) : false;
        
        // Get sender info from the message object
        const sender = message.sender || {};
    
        
        return (
          <MessageBubble
            key={message._id}
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
};

export default React.memo(MessagesArea)