import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats }               from '../redux/slices/chatSlice';
import { Link }                     from 'react-router-dom';
import { Loader2 } from "lucide-react";

const ChatListPage = () => {
  const dispatch = useDispatch();
  const { user }               = useSelector(state => state.auth);
  const { list: chats, status } = useSelector(state => state.chat);
  const [loading, setLoading]  = useState(true);
  console.log(chats)

  useEffect(() => {
    dispatch(fetchChats()).finally(() => setLoading(false));
  }, [dispatch]);

  if (status === 'loading' || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
        <Loader2 className='w-8 h-8 animate-spin ' />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>

      {chats.length > 0 ? (
        chats.map(chat => {
          const other   = chat.user1._id === user._id ? chat.user2 : chat.user1;
          const lastMsg = [...chat.messages]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || {};

          return (
            <Link
              key={chat.chatId}
              to={`/chat/${chat.chatId}`}
              className="flex items-center border-b border-gray-200 py-4 hover:bg-gray-50 hover:shadow-sm transition"
            >
              <img
                src={other.profilePicture}
                alt={other.name}
                className="w-14 h-14 rounded-full mr-4"
              />
              <div className="flex-1">
                <div className="font-medium">{other.name}</div>
                <div className="text-sm text-gray-600 truncate">
                  {lastMsg.content}
                </div>
              </div>
              {lastMsg.timestamp && (
                <div className="text-xs text-gray-400 ml-2">
                  {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </Link>
          );
        })
      ) : (
        <div className="text-center py-6 text-gray-500">No chats yet.</div>
      )}
    </div>
  );
};

export default ChatListPage;
