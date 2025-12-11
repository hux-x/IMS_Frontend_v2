import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socketService, { connectSocket, disconnectSocket } from '@/apis/socket/config';
import { ToastContainer } from '@/components/layout/Toast';
import { AuthContext } from '@/context/authContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, setUnread } = useContext(AuthContext);
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);
  const isOnChatPage = location.pathname === '/chat';

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection if not already connected
    if (!socketRef.current) {
      socketRef.current = connectSocket(userId);
    }

    // Listen for new messages globally
    const handleNewMessage = (message) => {
      console.log('🔔 Global notification: New message received', message);
      
      // Don't show notification if user is on chat page and has that chat selected
      // This will be handled by the chat page itself
      if (isOnChatPage) {
        console.log('User is on chat page, skipping global notification');
        return;
      }

      // Show toast notification
      if (message.sender._id !== userId) {
        const chatId = typeof message.chat === 'object' ? message.chat._id : message.chat;
        addToast(message.message, message.sender.name, chatId);
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`New message from ${message.sender.name}`, {
            body: message.message,
            icon: '/logo.png',
            tag: chatId
          });
        }
        
        // Play notification sound
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (error) {
          console.log('Notification sound error:', error);
        }

        // Update global unread count
        setUnread(prev => prev + 1);
      }
    };

    socketService.onMessageReceived(handleNewMessage);

    return () => {
      socketService.offMessageReceived();
    };
  }, [userId, isOnChatPage, setUnread]);

  const addToast = (message, sender, chatId) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, sender, chatId }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleToastClick = (chatId) => {
    console.log('Toast clicked, navigating to chat:', chatId);
    // Navigate to chat page with the chat ID
    navigate('/chat', { state: { selectedChatId: chatId } });
  };

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      {!isOnChatPage && (
        <ToastContainer 
          toasts={toasts} 
          removeToast={removeToast} 
          onToastClick={handleToastClick}
        />
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;