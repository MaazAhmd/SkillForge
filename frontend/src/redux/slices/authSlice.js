import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/signup', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    error: null,
    status: 'idle',
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout,clearError } = authSlice.actions;
export default authSlice.reducer;
