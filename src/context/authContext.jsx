// src/context/authContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Install with npm i jwt-decode
import client from '@/apis/apiClient/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name,setName] = useState(null)
  const [email,setEmail] = useState()
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const verifyStoredToken = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    const storedUserId = localStorage.getItem("userId");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const verify_token = await client.get("/verify");
      if (verify_token.status !== 200) {
        logout();
        return;
      }

      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      setEmail(decoded.email);
      setName(decoded.name);
      setUserId(storedUserId || decoded.id);
      setIsAuthenticated(true);

    } catch (err) {
      console.error("Invalid token", err);
      logout();
    } finally {
      setLoading(false); // ✅ always stop loading
    }
  };

  verifyStoredToken();
}, []);


  const login = (token, userId) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("userId", userId);
    const decoded = jwtDecode(token);
    console.log("Login decoded token:", decoded); // Debug log
    setUserRole(decoded.role); // Adjust if needed
    setUserId(userId);
    setEmail(decoded.email);
    setName(decoded.name)
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout, loading,name,email, unread,setUnread }}>
      {children}
    </AuthContext.Provider>
  );
};