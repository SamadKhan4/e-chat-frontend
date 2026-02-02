import MessageItem from './MessageItem';

const MessageList = ({ messages, currentUser, isTyping }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map(msg => (
        <MessageItem 
          key={msg._id} 
          message={msg} 
          isCurrentUser={msg.sender._id === currentUser._id}
        />
      ))}
      {isTyping && (
        <div className="flex justify-start mb-2">
          <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;