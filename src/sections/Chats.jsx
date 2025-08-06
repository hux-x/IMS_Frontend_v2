import React, { useState, useEffect, useRef } from 'react';
import ChatListHeader from '@/components/chats/ChaListtHeader';
import ChatList from '@/components/chats/ChatList';
import ChatHeader from '@/components/chats/ChatHeader';
import MessagesArea from '@/components/chats/MessageArea';
import MessageInput from '@/components/chats/MessageInput';
import EmptyState from '@/components/chats/EmptyState';
import { 
  mockUsers, 
  mockTeams, 
  mockDirectMessages, 
  mockGroupMessages, 
  mockUnreadCounts 
} from '@/components/utils/mockData'; 

const Chat = () => {
  // Current user (simulated)
  const user = { id: 'user-1', name: 'John Doe' };
  
  const [messages, setMessages] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('direct');
  const [showMobile, setShowMobile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedChat) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        content: messageInput,
        timestamp: Date.now(),
        type: selectedChat.type
      };

      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
      }));
      
      setMessageInput('');
    }
  };

  const getDirectChats = () => {
    const otherUsers = mockUsers.filter(u => u.id !== user.id);
    return otherUsers.map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      type: 'direct',
      status: u.status,
      lastMessage: mockDirectMessages[u.id]?.slice(-1)[0],
      unreadCount: mockUnreadCounts.direct[u.id] || 0
    }));
  };

  const getGroupChats = () => {
    const userTeams = mockTeams.filter(team => team.members.includes(user.id));
    return userTeams.map(team => ({
      id: team.id,
      name: team.name,
      avatar: team.name.charAt(0),
      type: 'group',
      color: team.color,
      memberCount: team.members.length,
      lastMessage: mockGroupMessages[team.id]?.slice(-1)[0],
      unreadCount: mockUnreadCounts.group[team.id] || 0
    }));
  };

  const getCurrentMessages = () => {
    if (!selectedChat) return [];
    
    if (selectedChat.type === 'direct') {
      return [...(mockDirectMessages[selectedChat.id] || []), ...(messages[selectedChat.id] || [])];
    } else {
      return [...(mockGroupMessages[selectedChat.id] || []), ...(messages[selectedChat.id] || [])];
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredChats = activeTab === 'direct' ? getDirectChats() : getGroupChats();
  const searchedChats = filteredChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = getCurrentMessages();

  return (
    <div className="h-[88vh] flex bg-white">
      {/* Chat List with Header */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${showMobile && selectedChat ? 'hidden md:flex' : ''}`}>
        <ChatListHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
       <div className="flex-1 overflow-y-scroll overflow-x-hidden">
         <ChatList
          searchedChats={searchedChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setShowMobile={setShowMobile}
          showMobile={showMobile}
          searchTerm={searchTerm}
          formatTime={formatTime}
        />
       </div>
      </div>

      {/* Chat Messages Area */}
      <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : ''} ${showMobile && !selectedChat ? 'hidden' : ''}`}>
        {selectedChat ? (
          <>
            <ChatHeader selectedChat={selectedChat} setShowMobile={setShowMobile} />
            <MessagesArea
              currentMessages={currentMessages}
              user={user}
              selectedChat={selectedChat}
              formatTime={formatTime}
              messagesEndRef={messagesEndRef}
            />
            <MessageInput
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              handleSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Chat;