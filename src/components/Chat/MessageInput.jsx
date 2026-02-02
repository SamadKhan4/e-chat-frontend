import { useState } from 'react';

const MessageInput = ({ onSendMessage, activeChat }) => {
  const [messageInput, setMessageInput] = useState('');

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;
    
    try {
      await onSendMessage(messageInput);
      setMessageInput('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    }
  };

  return (
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
  );
};

export default MessageInput;