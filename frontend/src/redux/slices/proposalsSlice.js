import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Fetch all proposals associated with the user
export const fetchProposals = createAsyncThunk(
    "proposals/fetchProposals",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/proposals`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch proposals"
            );
        }
    }
);

const proposalsSlice = createSlice({
    name: "proposals",
    initialState: {
        proposals: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearProposalsState: (state) => {
            state.proposals = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Freelancer's applied proposals
            .addCase(fetchProposals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProposals.fulfilled, (state, action) => {
                state.loading = false;
                state.proposals = action.payload;
            })
            .addCase(fetchProposals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProposalsState } = proposalsSlice.actions;
export default proposalsSlice.reducer;
