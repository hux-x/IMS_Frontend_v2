import React from 'react';
import { MessageSquare, FileText, Download, Check, CheckCheck, Reply, AtSign } from 'lucide-react';
import TypingIndicator from './TypingIndicator';

const ChatMessages = ({
  messages,
  user,
  selectedChat,
  messageContainerRef,
  messagesEndRef,
  handleFileMessageClick,
  handleReply,
  scrollToMessage,
  formatTime,
  formatFileSize,
  getTypingText,
  handleMentionClick,
}) => {
  console.log("the actual messagesssssssssssss", messages);

  // Helper function to render message text with clickable mentions
  const renderMessageWithMentions = (message) => {
    // Support both 'mention' and 'mentions' field names
    const mentions = message.mention || message.mentions || [];
    
    if (mentions.length === 0) {
      return <p className="break-words">{message.message}</p>;
    }

    // Create a regex pattern to find all @mentions in the text
    const parts = [];
    let lastIndex = 0;
    const text = message.message;

    // Find all @mentions and their positions
    mentions.forEach((mentionedUser) => {
      const mentionText = `@${mentionedUser.name}`;
      const index = text.indexOf(mentionText, lastIndex);

      if (index !== -1) {
        // Add text before mention
        if (index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.substring(lastIndex, index),
          });
        }

        // Add mention
        parts.push({
          type: 'mention',
          content: mentionText,
          user: mentionedUser,
        });

        lastIndex = index + mentionText.length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    const isOwn = message?.sender?._id === user?._id;

    return (
      <p className="break-words">
        {parts.map((part, index) => {
          if (part.type === 'mention') {
            return (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMentionClick(part.user);
                }}
                className={`font-semibold cursor-pointer hover:underline ${
                  isOwn ? 'text-blue-200' : 'text-blue-600'
                }`}
              >
                {part.content}
              </span>
            );
          }
          return <span key={index}>{part.content}</span>;
        })}
      </p>
    );
  };

  // Check if a message mentions the current user (support both field names)
  const isMentioned = (message) => {
    return message.mention?.some((m) => m._id === user?._id) ||
           message.mentions?.some((m) => m._id === user?._id);
  };


// Also update renderMessageWithMentions to check both fields:


  // Rest of the function remains the same...


  return (
    <div 
      ref={messageContainerRef} 
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
      style={{ 
        maxHeight: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
          <p>No messages yet</p>
          <p className="text-sm">Send a message to start the conversation</p>
        </div>
      ) : (
        <>
          {messages?.map((message, index) => {
            const isOwn = message?.sender?._id === user?._id;
            const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
            const mentioned = isMentioned(message);

            return (
              <div
                key={message._id}
                id={`message-${message._id}`}
                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''} transition-all duration-300 ${
                  mentioned ? 'bg-yellow-50 -mx-2 px-2 py-1 rounded-lg' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {showAvatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                      {message.sender?.profile_picture_url ? (
                        <img
                          src={message.sender.profile_picture_url}
                          alt={message.sender.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {message.sender?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                </div>

                <div className={`flex flex-col max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
                  {showAvatar && !isOwn && selectedChat.isGroupChat && (
                    <span className="text-xs text-gray-600 mb-1 px-2">{message.sender.name}</span>
                  )}

                  <div className="group relative">
                    {message.messageType === 'file' ? (
                      <div
                        onClick={() => handleFileMessageClick(message)}
                        className={`rounded-2xl px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity ${
                          isOwn ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className={`w-8 h-8 ${isOwn ? 'text-blue-100' : 'text-blue-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                              {message?.fileName || 'File'}
                            </p>
                          </div>
                          <Download className={`w-5 h-5 flex-shrink-0 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`} />
                        </div>

                        <div className={`flex items-center gap-1 mt-2 text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {isOwn && (message.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />)}
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-2xl px-4 py-2 ${isOwn ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm'} ${
                        mentioned ? 'ring-2 ring-yellow-400' : ''
                      }`}>
                        {message.replyTo && (
                          <div
                            onClick={() => scrollToMessage(message.replyTo._id)}
                            className={`mb-2 pb-2 border-l-2 pl-2 cursor-pointer ${isOwn ? 'border-blue-300' : 'border-gray-300'}`}
                          >
                            <p className={`text-xs font-semibold ${isOwn ? 'text-blue-100' : 'text-blue-600'}`}>
                              {message.replyTo.sender?.name}
                            </p>
                            <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-600'} truncate`}>
                              {message.replyTo.message}
                            </p>
                          </div>
                        )}

                        {renderMessageWithMentions(message)}

                        <div className={`flex items-center gap-1 mt-1 text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {isOwn && (message.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />)}
                          {mentioned && !isOwn && (
                            <AtSign className="w-3 h-3 ml-1 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleReply(message)}
                      className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                      title="Reply"
                    >
                      <Reply className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {getTypingText() && (
            <div className="flex gap-3">
              <div className="w-8 h-8"></div>
              <TypingIndicator />
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessages;