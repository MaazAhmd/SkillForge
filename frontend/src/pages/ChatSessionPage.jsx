import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../redux/slices/chatSlice';
import socket from '../socket';
import axios from '../api/axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Paperclip, Smile, Send } from 'lucide-react';

const ChatSessionPage = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chat.list);
  const session = chats.find((c) => c._id === chatId);

  const [input, setInput] = useState('');
  const [attachmentData, setAttachmentData] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', { chatId, userId: user._id });
    if (!session) {
      axios
        .get(`/chat/${chatId}`)
        .then((res) => dispatch({ type: 'chat/upsertChat', payload: res.data.chat }))
        .catch(console.error);
    }
  }, [chatId, session, user._id, dispatch]);

  useEffect(() => {
    const handler = (msg) => {
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

  if (!session) return <div className="p-4">Loading chat…</div>;

  const other = session.user1._id === user._id ? session.user2 : session.user1;

  const isImageFile = (url) => url?.startsWith('http://localhost:5000/uploads/images');

  const handleSend = async () => {
    if (!input.trim() && !attachmentData) return;

    const tempId = `temp-${Date.now()}`;
    const tempAttachment = attachmentData
      ? {
          url: URL.createObjectURL(attachmentData.file),
          name: attachmentData.file.name,
        }
      : undefined;

    const optimistic = {
      _id: tempId,
      sender: {
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
      },
      receiver: {
        _id: other._id,
        name: other.name,
        profilePicture: other.profilePicture,
      },
      content: input,
      timestamp: new Date().toISOString(),
      chatId,
      attachment: tempAttachment,
    };

    dispatch(addMessage({ chatId, message: optimistic }));
    setInput('');
    setAttachmentData(null);

    try {
      const formData = new FormData();
      formData.append('receiverId', other._id);
      formData.append('content', input);
      if (attachmentData) {
        formData.append('attachment', attachmentData.file);
      }

      const res = await axios.post('/chat/message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const msg = res.data.message;
      dispatch(addMessage({ chatId, message: msg }));
      socket.emit('sendMessage', { ...msg, chatId });
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  function convertToDownloadUrl(url) {
    return url.replace('/uploads/', '/download/');
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-md sticky top-0 z-10">
        <img
          src={other.profilePicture}
          alt={other.name}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-semibold">{other.name}</h2>
          <p className="text-sm text-gray-500">Last seen 2 hours ago</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map((msg) => {
          const isMine = msg.sender._id === user._id;
          const attachmentUrl = msg.attachment?.url;
          const attachmentName = msg.attachment?.name;

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-4 rounded-lg max-w-xs break-words shadow ${
                  isMine ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {!isMine && (
                  <p className="text-xs font-semibold mb-1">{msg.sender.name}</p>
                )}

                {msg.content && <p className="text-sm">{msg.content}</p>}

                {attachmentUrl && (
                  <>
                    {isImageFile(attachmentUrl) ? (
                      <img
                        src={attachmentUrl}
                        alt={attachmentName || 'attachment'}
                        className="mt-2 max-w-full rounded"
                      />
                    ) : (
                      <div className="mt-2 p-2 bg-white text-gray-700 rounded shadow flex items-center">
                        <Paperclip className="w-6 h-6 text-gray-600 mr-2" />
                        <p className="text-sm">{attachmentName || 'File'}</p>
                      </div>
                    )}
                    <a
                      href={convertToDownloadUrl(attachmentUrl)}
                      className="mt-1 inline-block text-sm text-blue-600 underline"
                    >
                      Download
                    </a>
                  </>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white shadow-md sticky bottom-0 z-10">
        {attachmentData && (
          <div className="mb-2 flex items-center bg-gray-100 p-2 rounded">
            <span className="flex-1 text-sm">{attachmentData.file.name}</span>
            <button
              onClick={() => setAttachmentData(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center">
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="mr-2 p-2 rounded-full hover:bg-gray-200"
          >
            <Smile className="w-6 h-6 text-gray-600" />
          </button>
          {showPicker && (
            <div className="absolute bottom-16 left-4 z-10">
              <Picker
                data={data}
                onEmojiSelect={(e) => {
                  setInput((i) => i + e.native);
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 rounded-full bg-blue-500 text-white flex items-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSessionPage;