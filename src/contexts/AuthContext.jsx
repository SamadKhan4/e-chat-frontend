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
      
      // Token is now stored in cookies via backend, no need to store in localStorage
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
      
      // Token is now stored in cookies via backend, no need to store in localStorage
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear token cookie by setting expiration to past
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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