import React from 'react';
import { MessageSquare, FileText, Download, Check, CheckCheck, Reply } from 'lucide-react';
import TypingIndicator from './TypingIndicator'; // make sure you have this component


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
}) => {
  return (
    <div 
      ref={messageContainerRef} 
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
      style={{ 
        maxHeight: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' // For smooth scrolling on iOS
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
          {messages.map((message, index) => {
            const isOwn = message.sender._id === user?._id;
            const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;

            return (
              <div
                key={message._id}
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
                              {message.fileMetadata?.fileName || 'File'}
                            </p>
                            <p className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                              {message.fileMetadata?.size ? formatFileSize(message.fileMetadata.size) : 'Unknown size'}
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
                      <div className={`rounded-2xl px-4 py-2 ${isOwn ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-900 rounded-tl-sm'}`}>
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

                        <p className="break-words">{message.message}</p>

                        <div className={`flex items-center gap-1 mt-1 text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {isOwn && (message.isRead ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />)}
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