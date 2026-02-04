import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  MessageSquare, 
  Search, 
  X, 

} from 'lucide-react';
import { ToastContainer } from '@/components/layout/Toast';
// New Chat Modal Component
const NewChatModal = ({ isOpen, onClose, allUsers, currentUserId, onStartChat, existingChats }) => {
  const [searchQuery, setSearchQuery] = useState('');
  console.log(allUsers)
  if (!isOpen) return null;

  const availableUsers = allUsers
    .filter(u => u._id !== currentUserId)
    .filter(u => {
      const chatExists = existingChats.some(chat => 
        !chat.isGroupChat && chat.users?.some(cu => cu._id === u._id)
      );
      return !chatExists;
    })
    .filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[70vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Start New Chat</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {availableUsers.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {searchQuery ? 'No users found' : 'All users have existing chats'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {availableUsers.map(user => (
                <button
                  key={user._id}
                  onClick={() => {
                    onStartChat(user);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NewChatModal;