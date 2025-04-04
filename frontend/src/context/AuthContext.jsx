import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Fix import
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated by validating the token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decoded.exp < currentTime) {
          console.warn('Token has expired. Logging out...');
          logout(); // Log the user out if the token is expired
        } else {
          setIsAuthenticated(true); // Token is valid, set authentication state to true
          startAutoLogout(); // Start the auto-logout timer
        }
      } catch (error) {
        console.error('Invalid token. Logging out...', error);
        logout(); // Log the user out if the token is invalid
      }
    }
  }, []);

  const startAutoLogout = () => {
    // Automatically log out the user after 10 minutes
    setTimeout(() => {
      console.warn('10 minutes have passed. Logging out...');
      logout();
    }, 600000); // 10 minutes in milliseconds
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    startAutoLogout(); // Start the auto-logout timer on login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to the login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);