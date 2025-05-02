import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

export const createTransaction = createAsyncThunk(
    "billing/create",
    async (payload, { rejectWithValue }) => {
        try {
            console.log(payload)
            const response = await api.post(`/api/transaction`, {
                ...payload
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "An error occured");
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    "billing/fetch",
    async ({ page = 1, id, startDate, endDate }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page, id, startDate, endDate });
            const response = await api.get(`/api/transaction?${params.toString()}`);
            console.log(response)
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "An error occurred");
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
            })
            .addCase(createTransaction.rejected, (state, action) => {
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

export default billingSlice.reducer;
