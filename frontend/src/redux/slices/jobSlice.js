import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const postJob = createAsyncThunk(
  'job/postJob',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/jobs/create', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/jobs/?sort=desc');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchCategories = createAsyncThunk(
  'job/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/jobs/categories');
      const names = res.data.map(cat => cat.name);
      return [ ...names];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const jobSlice = createSlice({
  name: 'job',
  initialState: {
    // For posting a job
    job: null,
    loading: false,
    error: null,
    success: false,

    // For browsing jobs
    jobs: [],
    filteredJobs: [],
    jobsLoading: false,
    jobsError: null,
    activeCategory: 'All Categories',
    searchQuery: '',


    categories: [],
    categoriesLoading: false,
    categoriesError: null,
    
  },

  reducers: {
    resetJobState: (state) => {
      state.job = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    setCategory: (state, action) => {
      state.activeCategory = action.payload;
      jobSlice.caseReducers.applyFilters(state);
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      jobSlice.caseReducers.applyFilters(state);
    },

    applyFilters: (state) => {
      const query = state.searchQuery.toLowerCase();
      state.filteredJobs = state.jobs.filter((job) => {
        const categoryMatch =
          state.activeCategory === 'All Categories' ||
          job.category?.toLowerCase() === state.activeCategory.toLowerCase();
        const searchMatch =
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query);
        return categoryMatch && searchMatch;
      });
    },
  },

  extraReducers: (builder) => {
    // Job Posting
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

    // Job Fetching
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs = action.payload;
        jobSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload;
      });


      builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = ['All Categories', ...action.payload];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      });

  },
});

export const {
  resetJobState,
  setCategory,
  setSearchQuery,
} = jobSlice.actions;

export default jobSlice.reducer;
