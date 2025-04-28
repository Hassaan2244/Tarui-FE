import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

export const createTransaction = createAsyncThunk(
    "billing/create",
    async (payload, { rejectWithValue }) => {
        try {
            console.log(payload)
            return
            const response = await api.post(`/api/ledger`, {

            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "An error occured");
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
    },
});

export default billingSlice.reducer;
