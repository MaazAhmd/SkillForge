import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Async thunk to fetch applied jobs
export const fetchAppliedJobs = createAsyncThunk(
    "appliedJobs/fetchAppliedJobs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/jobs/applied");
            console.log(res.data.data);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch applied jobs"
            );
        }
    }
);

const appliedJobsSlice = createSlice({
    name: "appliedJobs",
    initialState: {
        jobs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppliedJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(fetchAppliedJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default appliedJobsSlice.reducer;
