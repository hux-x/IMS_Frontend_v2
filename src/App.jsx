// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from '@/context/authContext';
import socketService, { connectSocket, disconnectSocket } from '@/apis/socket/config';
import Login from '@/pages/login';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/sections/Dashboard';
import Employees from '@/sections/Employees';
import Tasks from '@/sections/Tasks';
import Chats from '@/sections/Chats';
import Attendance from '@/sections/Attendance';
import Reports from '@/sections/Reports';
import Teams from '@/sections/Teams';
import AdminPanel from '@/sections/SystemManagement';
import TeamDashboard from './pages/TeamDashboard';
import ProjectProposed from '@/sections/ProjectProposed';
import Bugs from '@/sections/Bugs';
import MeetingDashboard from './sections/Meetings';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import CompanyFiles from './sections/CompanyFiles';
import MyFiles from './sections/MyFiles';
import RepositoryFiles from './sections/RepositoryFiles';
import TeamRepositories from './sections/TeamRepos';
import { ToastContainer } from './components/layout/Toast';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = React.useContext(AuthContext);
  
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (window.uploadInProgress) {
        e.preventDefault();
        e.returnValue = 'Files are currently being uploaded. If you leave, the upload will be cancelled. Are you sure?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" />;
  return children;
};

// Global Notification Component
const GlobalNotifications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, setUnread } = React.useContext(AuthContext);
  const [toasts, setToasts] = useState([]);
  const socketRef = React.useRef(null);
  const isOnChatPage = location.pathname === '/chat';

  useEffect(() => {
    if (!userId || isOnChatPage) return;

    console.log('🔔 Setting up global notifications');

    // Initialize socket connection if not already connected
    if (!socketRef.current) {
      socketRef.current = connectSocket(userId);
    }

    // Listen for new messages globally
    const handleNewMessage = (message) => {
      console.log('🔔 Global notification: New message received', message);
      
      // Show notification only if not the sender
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

 const addToast = (message, sender, chatId, isMention = false) => {
  const id = Date.now();
  setToasts((prev) => [...prev, { id, message, sender, chatId, isMention }]);
};

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleToastClick = (chatId) => {
    console.log('Toast clicked, navigating to chat:', chatId);
    // Navigate to chat page with the chat ID in state
    navigate('/chat', { state: { selectedChatId: chatId } });
    // Clear all toasts after navigation
    setToasts([]);
  };

  // Don't render toasts on chat page
  if (isOnChatPage) return null;

  return (
    <ToastContainer 
      toasts={toasts} 
      removeToast={removeToast} 
      onToastClick={handleToastClick}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route: Login page */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Public Routes for Password Reset */}
        <Route path="reset-password" element={<ResetPassword/>} />
        <Route path="forgot-password" element={<ForgotPassword/>} />

        {/* Chat Route (outside Layout) */}
        <Route path="chat" element={<Chats />} />

        {/* Private Routes wrapped in Layout with role-based access */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Default redirect */}
          <Route index path="dashboard" element={<Dashboard />} />
          
          {/* Common routes */}
          <Route path="tasks" element={<Tasks />} />
          <Route path="attendance" element={<Attendance />} />

          {/* Admin/Executive routes */}
          <Route path="employees" element={
            <PrivateRoute allowedRoles={['admin',"executive"]}>
              <Employees />
            </PrivateRoute>
          } />
          
          <Route path="reports" element={
            <PrivateRoute allowedRoles={['admin',"executive","manager"]}>
              <Reports />
            </PrivateRoute>
          } />
          
          <Route path="teams" element={
            <PrivateRoute allowedRoles={['admin',"executive"]}>
              <Teams />
            </PrivateRoute>
          } />
          
          <Route path="admin" element={
            <PrivateRoute allowedRoles={['admin',"executive"]}>
              <AdminPanel />
            </PrivateRoute>
          } />

          {/* File Management Routes */}
          <Route path="myFiles" element={
            <PrivateRoute allowedRoles={['admin',"executive","employee","manager"]}>
              <MyFiles/>
            </PrivateRoute>
          } />
          
          <Route path="companyFiles" element={
            <PrivateRoute allowedRoles={['admin',"executive"]}>
              <CompanyFiles/>
            </PrivateRoute>
          } />
          
          <Route path="files/:repoId" element={
            <PrivateRoute allowedRoles={['admin',"executive","teamLead","manager","employee"]}>
              <RepositoryFiles/>
            </PrivateRoute>
          } />
          
          <Route path="repos/:teamId" element={
            <PrivateRoute allowedRoles={['admin',"executive","teamLead"]}>
              <TeamRepositories/>
            </PrivateRoute>
          } />

          {/* Other Routes */}
          <Route path="teamdashboard" element={<TeamDashboard />} />
          <Route path="teamdashboard/:teamId" element={<TeamDashboard />} />
          <Route path="projectproposed" element={<ProjectProposed />} />
          <Route path="bugs" element={<Bugs />} />
          <Route path="meetings" element={<MeetingDashboard />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      
      <ReactToastContainer position="top-right" autoClose={3000} />
      <GlobalNotifications />
    </AuthProvider>
  );
}

export default App;