import React from 'react';

function MessageCard({ message }) {
  return (
    <div className="flex items-start space-x-3 mb-3">
      <img
        src={message.avatar}
        alt={message.author}
        className="w-8 h-8 rounded-full"
      />
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{message.author}</span>
          <span className="text-sm text-gray-500">{message.time}</span>
        </div>
        <p className="text-sm text-gray-600">{message.message}</p>
      </div>
    </div>
  );
}

export default MessageCard;
