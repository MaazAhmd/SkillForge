import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Thunk to fetch account by userId
export const fetchAccount = createAsyncThunk(
    "account/fetchAccount",
    async (thunkAPI) => {
        try {
            const res = await axios.get(`/accounts/user`);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message ||
                    "Failed to fetch account for the user"
            );
        }
    }
);

// Thunk to add funds
export const addFunds = createAsyncThunk(
    "account/addFunds",
    async ({ accountId, amount }, thunkAPI) => {
        try {
            const res = await axios.post(`/accounts/${accountId}/add`, {
                amount,
            });
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Thunk to withdraw funds
export const withdrawFunds = createAsyncThunk(
    "account/withdrawFunds",
    async ({ accountId, amount }, thunkAPI) => {
        try {
            const res = await axios.post(`/accounts/${accountId}/withdraw`, {
                amount,
            });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

const accountSlice = createSlice({
    name: "account",
    initialState: {
        account: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetAccount: (state) => {
            state.account = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccount.fulfilled, (state, action) => {
                state.account = action.payload;
                state.loading = false;
            })
            .addCase(fetchAccount.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(addFunds.fulfilled, (state, action) => {
                state.account = action.payload;
            })
            .addCase(withdrawFunds.fulfilled, (state, action) => {
                state.account = action.payload;
            });
    },
});

export const { resetAccount } = accountSlice.actions;
export default accountSlice.reducer;
