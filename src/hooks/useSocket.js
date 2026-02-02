import { useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://e-chat-production.up.railway.app';

let socketInstance = null;

export const useSocket = (user, onMessageReceived) => {
  useEffect(() => {
    if (user && !socketInstance) {
      // Extract token from document.cookie
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      console.log('Connecting socket with token:', !!token);
      
      socketInstance = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        auth: {
          token: token
        },
        query: {
          token: token // Also send as query param for fallback
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });
      
      socketInstance.on('connected', () => {
        console.log('Connected to server');
      });
      
      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });
      
      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
      
      socketInstance.on('receive_message', (message) => {
        if (onMessageReceived) {
          onMessageReceived(message);
        }
      });
      
      // Setup user connection
      socketInstance.emit('setup', user);
    }
    
    return () => {
      if (socketInstance) {
        socketInstance.close();
        socketInstance = null;
      }
    };
  }, [user, onMessageReceived]);

  return socketInstance;
};