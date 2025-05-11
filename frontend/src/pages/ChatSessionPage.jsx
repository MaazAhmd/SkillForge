import React, { useEffect, useRef, useState } from 'react';
import { useParams }                         from 'react-router-dom';
import { useSelector, useDispatch }          from 'react-redux';
import { addMessage }                        from '../redux/slices/chatSlice';
import socket                                from '../socket';
import axios                                 from '../api/axios';
import Picker                                from '@emoji-mart/react';
import data                                  from '@emoji-mart/data';
import { File, Image }                       from 'lucide-react';
import AttachmentInput from '../components/AttachmentInput';

const ChatSessionPage = () => {
  const { chatId } = useParams();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);
  const chats     = useSelector(s => s.chat.list);
  const session   = chats.find(c => c._id === chatId);

  const [input, setInput]                 = useState('');
  const [attachmentData, setAttachmentData] = useState(null); // { file, mode }
  const [showPicker, setShowPicker]       = useState(false);
  const messagesEndRef                    = useRef(null);

  // join room & fetch session if needed
  useEffect(() => {
    socket.emit('join', { chatId, userId: user._id });
    if (!session) {
      axios.get(`/chat/${chatId}`)
        .then(res => dispatch({ type: 'chat/upsertChat', payload: res.data.chat }))
        .catch(console.error);
    }
  }, [chatId, session, user._id, dispatch]);

  // incoming messages
  useEffect(() => {
    const handler = msg => {
      if (msg.chatId === chatId) {
        dispatch(addMessage({ chatId, message: msg }));
      }
    };
    socket.on('receiveMessage', handler);
    return () => socket.off('receiveMessage', handler);
  }, [chatId, dispatch]);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (!session) return <div className="p-4">Loading chat…</div>;

  const other = session.user1._id === user._id
    ? session.user2
    : session.user1;

  const isImageFile = file => file?.startsWith('http://localhost:5000/uploads/images');


function removeLocalhostPrefix(url) {
  const prefixes = [
    "http://localhost:5000/uploads/images/attachment-",
    "http://localhost:5000/uploads/files/"
  ];

  for (const prefix of prefixes) {
    if (url.startsWith(prefix)) {
      url = url.slice(prefix.length);
      break;
    }
  }

  if (url.endsWith(".avif")) {
    url = url.slice(0, -5); 
  }

  return url;
}

const handleSend = async () => {
  if (!input.trim() && !attachmentData) return;

  const tempId = `temp-${Date.now()}`;
  const optimistic = {
    _id: tempId,
    sender:   { _id: user._id, name: user.name, profilePicture: user.profilePicture },
    receiver: { _id: other._id, name: other.name, profilePicture: other.profilePicture },
    content:  input,
    timestamp: new Date().toISOString(),
    chatId,
    attachment: attachmentData ? URL.createObjectURL(attachmentData.file) : undefined,
  };

  // Show optimistic message immediately
  dispatch(addMessage({ chatId, message: optimistic }));

  // Reset UI
  setInput('');
  setAttachmentData(null);

  try {
    const formData = new FormData();
    formData.append('receiverId', other._id);
    formData.append('content', input);
    if (attachmentData) {
      formData.append('mode', attachmentData.mode);
      formData.append('attachment', attachmentData.file);
    }

    const res = await axios.post('/chat/message', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const msg = res.data.message;

    // Add the confirmed message for sender
    dispatch(addMessage({ chatId, message: msg }));

    // Send real message via socket for receiver
    socket.emit('sendMessage', { ...msg, chatId });
  } catch (err) {
    console.error('Send failed:', err);
    // Optionally: show error or retry mechanism
  }
};

console.log(session)
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <img
          src={other.profilePicture}
          alt={other.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <h2 className="text-lg font-semibold">{other.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map(msg => {
          const sid = typeof msg.sender._id === 'string'
            ? msg.sender._id
            : msg.sender._id.toString();
          const isMine = sid === user._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs break-words ${
                  isMine ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {!isMine && (
                  <p className="text-xs font-semibold mb-1">{msg.sender.name}</p>
                )}

                {/* Text */}
                {msg.content && <p className="text-sm">{msg.content}</p>}

                {/* Attachment */}
                {msg.attachment && (
                  isImageFile(msg.attachment)
                  ? <><img
                      src={ msg.attachment}
                      alt={removeLocalhostPrefix(msg.attachment)}
                      className="mt-2 max-w-full rounded"
                    />
                    <p>{removeLocalhostPrefix(msg.attachment)}</p>
                    </>
                  : <div className="mt-2 p-2 bg-white rounded shadow flex items-center">
                      <File className="w-6 h-6 text-gray-600 mr-2" />
                      <a
                        href={msg.attachment }
                        download={msg.attachment}
                        className="text-sm text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {removeLocalhostPrefix(msg.attachment)}
                      </a>
                    </div>
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
      <div className="p-4 border-t">
        {/* Selected file preview */}
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

        <div className="flex items-center relative">
          {/* Attachment picker */}
          <AttachmentInput onFileSelect={setAttachmentData} />

          {/* Emoji picker */}
          <button
            onClick={() => setShowPicker(v => !v)}
            className="mr-2 p-1 rounded hover:bg-gray-200"
          >
            😊
          </button>
          {showPicker && (
            <div className="absolute bottom-12 left-10 z-10">
              <Picker
                data={data}
                onEmojiSelect={e => {
                  setInput(i => i + e.native);
                  setShowPicker(false);
                }}
              />
            </div>
          )}

          {/* Text input */}
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2"
            placeholder="Type a message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 rounded-full bg-blue-500 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSessionPage;
