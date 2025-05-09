import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
            });
    },
});

export default projectSlice.reducer;
