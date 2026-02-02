/* eslint-disable no-useless-catch */
import { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'https://e-chat-production.up.railway.app/api';

// Configure axios to include credentials (cookies)
axios.defaults.withCredentials = true;

// Create an instance of axios with credentials enabled
const api = axios.create({
  baseURL: 'https://e-chat-production.up.railway.app/api',
  withCredentials: true,
});

// Function to get token from either cookies or localStorage
const getToken = () => {
  // Try to get from cookies first
  const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (cookieToken) {
    return cookieToken;
  }
  // Fallback to localStorage
  return localStorage.getItem('token');
};

// Function to set token in both cookies (via backend) and localStorage as fallback
const setToken = (token) => {
  // Store in localStorage as fallback
  localStorage.setItem('token', token);
};

// Function to clear token from localStorage
const clearToken = () => {
  // Clear from localStorage
  localStorage.removeItem('token');
  // Clear cookie
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post(`/auth/login`, {
        email,
        password
      });
      
      // Store token in localStorage as fallback
      setToken(response.data.token);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post(`/auth/register`, {
        name,
        email,
        password
      });
      
      // Store token in localStorage as fallback
      setToken(response.data.token);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear token from both localStorage and cookie
    clearToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;