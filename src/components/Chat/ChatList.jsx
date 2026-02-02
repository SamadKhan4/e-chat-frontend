const ChatList = ({ chats, activeChat, onChatSelect, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map(chat => (
        <div
          key={chat._id}
          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${activeChat?._id === chat._id ? 'bg-blue-50' : ''}`}
          onClick={() => {
            onChatSelect(chat);
          }}
        >
          <div className="font-semibold">
            {chat.isGroupChat 
              ? chat.groupName 
              : chat.users.filter(u => u._id !== currentUser._id)[0]?.name || 'Unknown User'
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
  );
};

export default ChatList;