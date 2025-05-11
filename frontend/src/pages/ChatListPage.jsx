import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats }               from '../redux/slices/chatSlice';
import { Link }                     from 'react-router-dom';

const ChatListPage = () => {
  const dispatch = useDispatch();
  const { user }  = useSelector(state => state.auth);
  const { list: chats, status } = useSelector(state => state.chat);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    dispatch(fetchChats()).finally(() => setLoading(false));
  }, [dispatch]);

  if (status === 'loading' || loading) {
    return <div className="p-4">Loading…</div>;
  }
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      {chats.map(chat => {
        const other = chat.user1._id === user._id ? chat.user2 : chat.user1;
        const lastMsg = [...chat.messages]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || {};

        return (
          <Link
            key={chat._id}
            to={`/chat/${chat.chatId}`}
            className="flex items-center border-b py-3 hover:bg-gray-100"
          >
            <img
              src={other.profilePicture}
              alt={other.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1">
              <div className="font-medium">{other.name}</div>
              <div className="text-sm text-gray-600 truncate">{lastMsg.content}</div>
            </div>
            {lastMsg.timestamp && (
              <div className="text-xs text-gray-400 ml-2">
                {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </Link>
        );
      })}
      {chats.length === 0 && <div>No chats yet.</div>}
    </div>
  );
};

export default ChatListPage;
