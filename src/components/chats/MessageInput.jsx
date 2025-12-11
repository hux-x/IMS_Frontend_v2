// components/MessageInput.jsx
import React from 'react';
import { Send, Paperclip, X, Reply, FolderOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MessageInput = ({ 
  value, 
  onChange, 
  onSend, 
  replyingTo, 
  onCancelReply, 
  sending,
  chatRepository
}) => {
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFilesClick = () => {
    if (chatRepository) {
      navigate(`/files/${chatRepository}`);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {replyingTo && (
        <div className="mb-3 bg-gray-100 rounded-lg p-3 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Reply className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">
                Replying to {replyingTo.sender.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{replyingTo.message}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>

        {chatRepository && (
          <button 
            onClick={handleFilesClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="View shared files"
          >
            <FolderOpen className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="flex-1 relative">
          <textarea
            id="message-input"
            value={value}
            onChange={onChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="1"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;