import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../redux/slices/chatSlice';
import socket from '../socket';
import axios from '../api/axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Paperclip, Smile, Send } from 'lucide-react';
import './ChatSessionPage.css'; // Import the CSS file

const ChatSessionPage = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chat.list);
  const session = chats.find((c) => c._id === chatId);

  const [input, setInput] = useState('');
  const [attachmentData, setAttachmentData] = useState(null); // { file, name }
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

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (!session) return <div className="loading">Loading chat…</div>;

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachmentData({ file, name: file.name });
    }
  };

  return (
    <div className="chat-session">
      {/* Header */}
      <div className="chat-header">
        <img
          src={other.profilePicture}
          alt={other.name}
          className="profile-picture"
        />
        <div>
          <h2 className="chat-name">{other.name}</h2>
          <p className="chat-last-seen">Last seen 2 hours ago</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {session.messages.map((msg) => {
          const isMine = msg.sender._id === user._id;
          const attachmentUrl = msg.attachment?.url;
          const attachmentName = msg.attachment?.name;

          return (
            <div
              key={msg._id}
              className={`chat-message ${isMine ? 'mine' : 'theirs'}`}
            >
              <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                {!isMine && (
                  <p className="sender-name">{msg.sender.name}</p>
                )}

                {msg.content && <p className="message-content">{msg.content}</p>}

                {attachmentUrl && (
                  <>
                    {isImageFile(attachmentUrl) ? (
                      <img
                        src={attachmentUrl}
                        alt={attachmentName || 'attachment'}
                        className="message-image"
                      />
                    ) : (
                      <div className="attachment">
                        <Paperclip className="attachment-icon" />
                        <p className="attachment-name">{attachmentName || 'File'}</p>
                      </div>
                    )}
                    <a
                      href={convertToDownloadUrl(attachmentUrl)}
                      className="download-link"
                    >
                      Download File
                    </a>
                  </>
                )}

                <p className={`message-time ${isMine ? 'mine' : 'theirs'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input">
        {attachmentData && (
          <div className="attachment-preview">
            <span className="attachment-name">{attachmentData.file.name}</span>
            <button
              onClick={() => setAttachmentData(null)}
              className="remove-attachment"
            >
              ×
            </button>
          </div>
        )}

        <div className="input-container">
          <label htmlFor="file-input" className="emoji-button">
            <Paperclip className="emoji-icon" />
          </label>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={() => setShowPicker((v) => !v)}
            className="emoji-button"
          >
            <Smile className="emoji-icon" />
          </button>
          {showPicker && (
            <div className="emoji-picker">
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
            className="message-input"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button
            onClick={handleSend}
            className="send-button"
          >
            <Send className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSessionPage;