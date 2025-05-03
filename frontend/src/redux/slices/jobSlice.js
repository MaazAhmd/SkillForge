import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const postJob = createAsyncThunk(
  'job/postJob',
  async (formData, { getState, rejectWithValue }) => {
    try {

      const response = await axios.post('/job-posts/create', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );z
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    job: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetJobState: (state) => {
      state.job = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
        state.success = true;
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;
