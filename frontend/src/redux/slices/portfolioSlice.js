import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const addPortfolio = createAsyncThunk(
  'portfolio/add',
  async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/portfolio/create', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    items: [],       
    adding: false,
    addError: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addPortfolio.pending, (state) => {
        state.adding = true;
        state.addError = null;
      })
      .addCase(addPortfolio.fulfilled, (state, action) => {
        state.adding = false;
        state.items.unshift(action.payload);
      })
      .addCase(addPortfolio.rejected, (state, action) => {
        state.adding = false;
        state.addError = action.payload;
      });
      
  }
});

export default portfolioSlice.reducer;
