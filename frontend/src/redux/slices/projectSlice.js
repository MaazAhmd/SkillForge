import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios"; // Adjust the path as necessary

// Thunk to fetch active projects
export const fetchActiveProjects = createAsyncThunk(
  "projects/fetchActiveProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/projects"); // Assumes auth handled via cookie/token
      return response.data.data; // Your ApiResponse wraps data like { status, data, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load projects"
      );
    }
  }
);
export const deliverWork = createAsyncThunk(
  "projects/deliverWork",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/projects/${projectId}/deliver`);
      console.log(response.data);
      return response.data?.data; // Assuming the API returns the updated project
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to deliver work"
      );
    }
  }
);
export const markAsDelivered = createAsyncThunk(
  "projects/markAsDelivered",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/projects/${projectId}/mark-complete`
      );
      return response.data?.data; // Assuming the API returns the updated project
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark project as delivered"
      );
    }
  }
);

export const cancelProject = createAsyncThunk(
  "projects/cancelProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/projects/${projectId}/cancel`);
      return response.data?.data; // Assuming the API returns the updated project
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel project"
      );
    }
  }
);
const projectSlice = createSlice({
  name: "project",
  initialState: {
    activeProjects: [],
    loading: false,
    error: null,
  },
  reducers: {
    addProject: (state, action) => {
      state.activeProjects.push(action.payload);
    },
    removeProject: (state, action) => {
      state.activeProjects = state.activeProjects.filter(
        (project) => project._id !== action.payload
      );
    },
    updateProject: (state, action) => {
      const index = state.activeProjects.findIndex(
        (project) => project._id === action.payload._id
      );
      if (index !== -1) {
        state.activeProjects[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.activeProjects = action.payload;
      })
      .addCase(fetchActiveProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deliverWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliverWork.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activeProjects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.activeProjects[index] = action.payload; // Update the delivered project
        }
      })
      .addCase(deliverWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAsDelivered.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsDelivered.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activeProjects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.activeProjects[index] = action.payload; // Update the project as delivered
        }
      })
      .addCase(markAsDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activeProjects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.activeProjects[index] = action.payload; // Update the project as canceled
        }
      })
      .addCase(cancelProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
