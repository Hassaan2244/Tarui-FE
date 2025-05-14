import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

export const createTransaction = createAsyncThunk(
    "billing/create",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/transaction`, {
                ...payload
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "An error occured");
        }
    }
);

export const createOpenSellTransaction = createAsyncThunk(
    "billing/openSell/create",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/transaction/openSell`, {
                ...payload
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "An error occured");
        }
    }
);

export const createBreakageTransaction = createAsyncThunk(
    "billing/breakage/create",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/transaction/breakage`, {
                ...payload
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "An error occured");
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    "billing/fetch",
    async ({ page = 1, id, startDate, endDate }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page, id, startDate, endDate });
            const response = await api.get(`/api/transaction?${params.toString()}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "An error occurred");
        }
    }
);


const billingSlice = createSlice({
    name: "billing",
    initialState: {
        transactions: null,
        singletransaction: null,
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearBillingState: (state) => {
            state.error = null;
            state.success = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
                state.singletransaction = action.payload?.data;
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create OpenSell Transaction
            .addCase(createOpenSellTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createOpenSellTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
                state.singletransaction = action.payload?.data;
                console.log(action.payload)
            })
            .addCase(createOpenSellTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Breakage Transaction
            .addCase(createBreakageTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createBreakageTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
            })
            .addCase(createBreakageTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearBillingState } = billingSlice.actions;

export default billingSlice.reducer;
