// src/context/authContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Install with npm i jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUserId = localStorage.getItem("userId");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // Debug log
        setUserRole(decoded.role); // Adjust if your JWT uses a different key (e.g., decoded.roles)
        setUserId(storedUserId || decoded.id);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid token', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userId) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("userId", userId);
    const decoded = jwtDecode(token);
    console.log("Login decoded token:", decoded); // Debug log
    setUserRole(decoded.role); // Adjust if needed
    setUserId(userId);
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
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};