import React from 'react';
import { MessageCircle } from 'lucide-react';

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Select a conversation
      </h3>
      <p className="text-gray-600">
        Choose a conversation from the sidebar to start messaging
      </p>
    </div>
  </div>
);

export default EmptyState;