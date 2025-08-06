import React from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import Button from '@/components/custom/CustomButton';
import Input from '@/components/custom/Input';

const MessageInput = ({ messageInput, setMessageInput, handleSendMessage }) => (
  <div className="p-4 border-t border-gray-200 bg-white">
    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
      <Button type="button" variant="ghost" size="sm">
        <Paperclip className="w-4 h-4" />
      </Button>
      <Button type="button" variant="ghost" size="sm">
        <Smile className="w-4 h-4" />
      </Button>
      <Input
        placeholder="Type a message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!messageInput.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  </div>
);

export default MessageInput;