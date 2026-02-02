import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const API_URL = 'https://e-chat-production.up.railway.app/api';
const SOCKET_URL = 'https://e-chat-production.up.railway.app';

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState(true);
  
  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: token
        }
      });
      
      setSocket(newSocket);
      
      newSocket.on('connected', () => {
        console.log('Connected to server');
      });
      
      newSocket.on('receive_message', (message) => {
        if (activeChat && message.chat === activeChat._id) {
          setMessages(prev => [...prev, message]);
        }
      });
      
      newSocket.on('typing', () => {
        console.log('User is typing...');
      });
      
      newSocket.on('stop_typing', () => {
        console.log('User stopped typing');
      });
      
      return () => {
        newSocket.close();
      };
    }
  }, [user, activeChat]);
  
  // Fetch user chats
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);
  
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  
  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: username,
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSocket(null);
    setActiveChat(null);
    setChats([]);
    setMessages([]);
  };
  
  const createChat = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/chat`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChats(prev => [response.data, ...prev]);
      setActiveChat(response.data);
      fetchMessages(response.data._id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create chat');
    }
  };
  
  const sendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;
    
    const messageData = {
      content: messageInput,
      chatId: activeChat._id
    };
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/chat/message`, messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [...prev, response.data]);
      setMessageInput('');
      
      // Emit to socket
      socket.emit('send_message', {
        chatId: activeChat._id,
        content: messageInput,
        sender: user
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">E-Chat</h2>
          
          <form onSubmit={loginMode ? handleLogin : handleRegister}>
            {!loginMode && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!loginMode}
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {loginMode ? 'Login' : 'Register'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setLoginMode(!loginMode)}
              className="text-blue-600 hover:text-blue-800"
            >
              {loginMode ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">E-Chat</h1>
          <p className="text-sm opacity-80">Welcome, {user.name}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat._id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${activeChat?._id === chat._id ? 'bg-blue-50' : ''}`}
              onClick={() => {
                setActiveChat(chat);
                fetchMessages(chat._id);
                socket.emit('join_room', chat._id);
              }}
            >
              <div className="font-semibold">
                {chat.isGroupChat 
                  ? chat.groupName 
                  : chat.users.filter(u => u._id !== user._id)[0]?.name || 'Unknown User'
                }
              </div>
              <div className="text-xs text-gray-500 truncate">
                {chat.latestMessage 
                  ? `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}`
                  : 'No messages yet'}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
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
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`mb-4 ${msg.sender._id === user._id ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender._id === user._id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                  >
                    <div className="font-semibold text-xs mb-1">
                      {msg.sender.name}
                    </div>
                    <div>{msg.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition duration-200"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;