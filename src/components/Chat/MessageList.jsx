import MessageItem from './MessageItem';

const MessageList = ({ messages, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map(msg => (
        <MessageItem 
          key={msg._id} 
          message={msg} 
          isCurrentUser={msg.sender._id === currentUser._id}
        />
      ))}
    </div>
  );
};

export default MessageList;