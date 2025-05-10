import React, { useEffect, useRef, useState } from 'react';
import { useParams }                         from 'react-router-dom';
import { useSelector, useDispatch }          from 'react-redux';
import { addMessage }                        from '../redux/slices/chatSlice';
import socket                                from '../socket';
import axios                                 from '../api/axios';
import Picker                                from '@emoji-mart/react';
import data                                  from '@emoji-mart/data';

const ChatSessionPage = () => {
  const { chatId } = useParams();
  const dispatch  = useDispatch();
  const { user }  = useSelector(state => state.auth);
  const chats     = useSelector(state => state.chat.list);
  const session   = chats.find(c => c._id === chatId);
  const [input, setInput]         = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef            = useRef(null);

  useEffect(() => {
    socket.emit('join', { chatId, userId: user._id });
    if (!session) {
      axios.get(`/chat/${chatId}`)
        .then(res => dispatch({ type: 'chat/upsertChat', payload: res.data.chat }))
        .catch(console.error);
    }
  }, [chatId, session, user._id, dispatch]);

  useEffect(() => {
    const handler = msg => {
      console.log(msg, 'msg in handler');
      if (msg.chatId === chatId) {
        dispatch(addMessage({ chatId, message: msg }));
      }
    };
    socket.on('receiveMessage', handler);
    return () => socket.off('receiveMessage', handler);
  }, [chatId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (!session) {
    return <div className="p-4">Loading chat…</div>;
  }

  const other = session.user1._id === user._id
    ? session.user2
    : session.user1;

    // console.log(session, 'session');

  const handleSend = async () => {
    if (!input.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      sender:   { _id: user._id, name: user.name, profilePicture: user.profilePicture },
      receiver: { _id: other._id, name: other.name, profilePicture: other.profilePicture },
      content:  input,
      timestamp: new Date().toISOString(),
      chatId
    };
    dispatch(addMessage({ chatId, message: optimistic }));
    setInput('');

    try {
      const res = await axios.post('/chat/message', {
        chatId,
        receiverId: other._id,
        content: input
      });
      const msg = res.data.message;
      socket.emit('sendMessage', {
        ...msg,
        chatId,
        receiver: optimistic.receiver
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* header */}
      <div className="flex items-center p-4 border-b">
        <img src={other.profilePicture} alt={other.name} className="w-10 h-10 rounded-full mr-3" />
        <h2 className="text-lg font-semibold">{other.name}</h2>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map(msg => {
          const sid = typeof msg.sender._id === 'string'
            ? msg.sender._id
            : msg.sender._id.toString();
          const isMine = sid === user._id;
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-xs ${isMine ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {!isMine && <p className="text-xs font-semibold mb-1">{msg.sender.name}</p>}
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div className="p-4 border-t flex items-center relative">
        <button onClick={() => setShowPicker(v => !v)} className="mr-2">😊</button>
        {showPicker && (
          <div className="absolute bottom-16 left-4 z-10">
            <Picker
              data={data}
              onEmojiSelect={e => {
                setInput(i => i + e.native);
                setShowPicker(false);
              }}
            />
          </div>
        )}
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Type a message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 rounded-full bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSessionPage;
