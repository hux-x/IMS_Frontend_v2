import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/custom/Input';

const ChatListHeader = ({ searchTerm, setSearchTerm, activeTab, setActiveTab }) => (
  <div className="p-4 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
    
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
    
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setActiveTab('direct')}
        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'direct'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Direct
      </button>
      <button
        onClick={() => setActiveTab('groups')}
        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'groups'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Groups
      </button>
    </div>
  </div>
);

export default ChatListHeader;