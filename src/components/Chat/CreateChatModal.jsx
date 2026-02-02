/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';

// Create an instance of axios with credentials enabled
const api = axios.create({
  baseURL: 'https://e-chat-production.up.railway.app/api',
  withCredentials: true,
});

const CreateChatModal = ({ isOpen, onClose, onCreateChat, currentUser }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setLoading(true);
    try {
      // No need to send token in headers since it's in cookies
      // Send email instead of userId
      const response = await api.post('/chat', { email: userId });
      
      onCreateChat(response.data);
      setUserId('');
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Start New Chat</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Email (of the person you want to chat with)
            </label>
            <input
              type="email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the email address of the user you want to chat with
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatModal;