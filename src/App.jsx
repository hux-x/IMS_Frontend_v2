// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from '@/context/authContext';
import Login from '@/pages/login';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/sections/Dashboard';
import Employees from '@/sections/Employees';
import Tasks from '@/sections/Tasks';
import Chats from '@/sections/Chats';
import Attendance from '@/sections/Attendance';
import Reports from '@/sections/Reports';
import Teams from '@/sections/Teams';
import AdminPanel from '@/sections/AdminPanel';
import TeamDashboard from './pages/TeamDashboard';
import ProjectProposed from '@/sections/ProjectProposed';
import Bugs from '@/sections/Bugs';
import MeetingDashboard from './sections/Meetings';
import { ChatProvider } from './context/ChatContext';
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = React.useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// 👇 New PublicRoute
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" />; // 👈 redirect logged-in users
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
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
          <Route index element={<Navigate to="/dashboard" />} />

          {/* Common routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="chat" element={<Chats />} />
          <Route path="attendance" element={<Attendance />} />

          {/* Admin-only routes */}
          <Route path="employees" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Employees />
            </PrivateRoute>
          } />
          <Route path="reports" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Reports />
            </PrivateRoute>
          } />
          <Route path="teams" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Teams />
            </PrivateRoute>
          } />
          <Route path="admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPanel />
            </PrivateRoute>
          } />

          <Route path="teamdashboard" element={<TeamDashboard />} />
          <Route path="teamdashboard/:teamId" element={<TeamDashboard />} />
          <Route path="projectproposed" element={<ProjectProposed />} />
          <Route path="bugs" element={<Bugs />} />
          <Route path="meetings" element={<MeetingDashboard />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      
      <ToastContainer position="top-right" autoClose={3000} />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
