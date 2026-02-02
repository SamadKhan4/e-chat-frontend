/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import ChatList from './ChatList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import CreateChatModal from './CreateChatModal';

// Create an instance of axios with credentials enabled
const api = axios.create({
  baseURL: 'https://e-chat-production.up.railway.app/api',
  withCredentials: true,
});

const API_URL = 'https://e-chat-production.up.railway.app/api';

const Chat = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch user chats
  const fetchChats = async () => {
    // No need to send token in headers since it's in cookies
    const response = await api.get('/chat');
    setChats(response.data);
  };

  const fetchMessages = async (chatId) => {
    // No need to send token in headers since it's in cookies
    const response = await api.get(`/chat/${chatId}/messages`);
    setMessages(response.data);
  };

  const sendMessage = async (content) => {
    if (!activeChat || !socket) return;
    
    const messageData = {
      content: content,
      chatId: activeChat._id,
      sender: user
    };
    
    // Emit to socket for other users
    socket.emit('send_message', messageData);
    
    // Save to database
    try {
      // No need to send token in headers since it's in cookies
      const response = await api.post(`/chat/message`, messageData);
      
      // Add message to UI after successful save
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to save message to database:', error);
    }
  };

  const handleCreateChat = (newChat) => {
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    fetchMessages(newChat._id);
    setIsCreateModalOpen(false);
  };

  // Handle incoming messages
  const handleNewMessage = (message) => {
    if (activeChat && message.chat === activeChat._id) {
      setMessages(prev => [...prev, message]);
    }
    
    // Also update the chat list to show latest message
    setChats(prevChats => 
      prevChats.map(chat => 
        chat._id === message.chat 
          ? { ...chat, latestMessage: message } 
          : chat
      )
    );
  };

  // Initialize socket
  const socket = useSocket(user, handleNewMessage);

  // Fetch chats when user is available
  if (user && chats.length === 0) {
    fetchChats();
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">E-Chat</h1>
          <p className="text-sm opacity-80">Welcome, {user.name}</p>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 flex items-center justify-center"
          >
            <span className="mr-2">+</span>
            New Chat
          </button>
        </div>
        
        <ChatList 
          chats={chats} 
          activeChat={activeChat} 
          currentUser={user}
          onChatSelect={(chat) => {
            setActiveChat(chat);
            fetchMessages(chat._id);
          }}
        />
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <div className="font-semibold">
                {activeChat.isGroupChat 
                  ? activeChat.groupName 
                  : activeChat.users.filter(u => u._id !== user._id)[0]?.name || 'Unknown User'
                }
              </div>
            </div>
            
            <MessageList messages={messages} currentUser={user} />
            <MessageInput onSendMessage={sendMessage} activeChat={activeChat} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
      
      <CreateChatModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateChat={handleCreateChat}
        currentUser={user}
      />
    </div>
  );
};

export default Chat;