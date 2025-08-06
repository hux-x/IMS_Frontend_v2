import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import ChatAvatar from '@/components/chats/ChatAvatar';
import Button from '@/components/custom/CustomButton';

const ChatHeader = ({ selectedChat, setShowMobile }) => (
  <div className="p-4 border-b border-gray-200 bg-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowMobile(false)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        
        <ChatAvatar chat={selectedChat} showStatus={true} />
        
        <div>
          <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
          <p className="text-sm text-gray-600">
            {selectedChat.type === 'direct' ? (
              <span className="capitalize">{selectedChat.status}</span>
            ) : (
              <span>{selectedChat.memberCount} members</span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {selectedChat.type === 'direct' && (
          <>
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

export default ChatHeader;