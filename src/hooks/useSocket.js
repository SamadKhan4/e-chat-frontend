import { useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://e-chat-production.up.railway.app';

let socketInstance = null;

export const useSocket = (user, onMessageReceived) => {
  useEffect(() => {
    if (user && !socketInstance) {
      const token = localStorage.getItem('token');
      socketInstance = io(SOCKET_URL, {
        auth: {
          token: token
        }
      });
      
      socketInstance.on('connected', () => {
        console.log('Connected to server');
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