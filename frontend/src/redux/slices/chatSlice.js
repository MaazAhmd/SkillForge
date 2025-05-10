// src/redux/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Fetch all chat sessions for the current user
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/chat');
      return res.data.chats;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load chats');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    list: [],
    activeChat: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.list.find(c => c._id === chatId);
      if (chat) {
        if (!Array.isArray(chat.messages)) {
          chat.messages = [];
        }
        chat.messages.push(message);
      }
    },
    upsertChat: (state, action) => {
      const chat = action.payload;
      const idx = state.list.findIndex(c => c._id === chat._id);
      if (idx >= 0) {
        state.list[idx] = { ...state.list[idx], ...chat };
      } else {
        state.list.push({ ...chat, messages: chat.messages || [] });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.map(chat => ({
          ...chat,
          messages: Array.isArray(chat.messages) ? chat.messages : []
        }));
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setActiveChat, addMessage, upsertChat } = chatSlice.actions;
export default chatSlice.reducer;
