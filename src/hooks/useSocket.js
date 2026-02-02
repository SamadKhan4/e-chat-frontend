import { useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://e-chat-production.up.railway.app';

export const useSocket = (user, onMessageReceived) => {
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      const socket = io(SOCKET_URL, {
        auth: {
          token: token
        }
      });
      
      socket.on('connected', () => {
        console.log('Connected to server');
      });
      
      socket.on('receive_message', (message) => {
        if (onMessageReceived) {
          onMessageReceived(message);
        }
      });
      
      return () => {
        socket.close();
      };
    }
  }, [user, onMessageReceived]);

  return null;
};