import { useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://e-chat-production.up.railway.app';

let socketInstance = null;

export const useSocket = (user, onMessageReceived) => {
  useEffect(() => {
    if (user && !socketInstance) {
      socketInstance = io(SOCKET_URL, {
        withCredentials: true, // Enable cookies
        auth: {
          // No need to send token in auth since it will be sent via cookies
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