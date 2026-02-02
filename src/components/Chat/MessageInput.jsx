import { useState } from 'react';

const MessageInput = ({ onSendMessage, activeChat, socket }) => {
  const [messageInput, setMessageInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(0);

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;
    
    try {
      await onSendMessage(messageInput);
      setMessageInput('');
      // Stop typing when message is sent
      if (socket && typing) {
        socket.emit('stop_typing', activeChat._id);
        setTyping(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    }
  };
  
  const handleTyping = () => {
    if (!socket || !activeChat) return;
    
    const now = Date.now();
    const timeDiff = now - lastTypingTime;
    
    if (timeDiff > 1000) {
      if (!typing) {
        setTyping(true);
        socket.emit('typing', activeChat._id);
      }
      setLastTypingTime(now);
    }
    
    // Auto-stop typing after 3 seconds
    setTimeout(() => {
      if (typing) {
        socket.emit('stop_typing', activeChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            } else {
              handleTyping();
            }
          }}
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
  );
};

export default MessageInput;