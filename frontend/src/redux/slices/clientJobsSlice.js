import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Thunk to fetch client job posts
export const fetchClientJobs = createAsyncThunk(
    "clientJobs/fetchClientJobs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/jobs/get/client");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch client jobs"
            );
        }
    }
);

const clientJobsSlice = createSlice({
    name: "clientJobs",
    initialState: {
        jobs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClientJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(fetchClientJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default clientJobsSlice.reducer;
