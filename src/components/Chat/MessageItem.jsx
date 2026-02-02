const MessageItem = ({ message, isCurrentUser }) => {
  return (
    <div className={`mb-4 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
      >
        <div className="font-semibold text-xs mb-1">
          {message.sender.name}
        </div>
        <div>{message.content}</div>
        <div className="text-xs opacity-70 mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;