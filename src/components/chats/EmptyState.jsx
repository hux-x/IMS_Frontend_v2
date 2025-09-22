import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

const EmptyState = ({ onlineUsers = [], totalChats = 0 }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-8">
        {/* Main Icon */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ChatBubbleLeftRightIcon className="w-10 h-10 text-blue-600" />
        </div>

        {/* Welcome Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Welcome to Team Chat
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Select a conversation from the sidebar to start messaging with your team members. 
          You can chat directly with colleagues or join group conversations.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-center mb-2">
              <UserGroupIcon className="w-6 h-6 text-gray-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalChats}</div>
            <div className="text-sm text-gray-500">
              {totalChats === 1 ? 'Chat' : 'Chats'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-center mb-2">
              <WifiIcon className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onlineUsers.length}</div>
            <div className="text-sm text-gray-500">Online</div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
          <ul className="text-left text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Click on any chat to start messaging instantly
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use the search bar to quickly find conversations
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Switch between direct and group chats using the tabs
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Green dots indicate when team members are online
            </li>
          </ul>
        </div>

        {/* Connection Status */}
        {onlineUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Connected and ready to chat</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;