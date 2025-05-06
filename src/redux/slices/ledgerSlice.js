import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

export const createLedger = createAsyncThunk(
    "ledger/create",
    async ({ name, description }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/ledger`, {
                name,
                description,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "An error occured");
        }
    }
);

export const fetchLedgers = createAsyncThunk(
    "ledger/fetch",
    async ({ page = 1, search = "" }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page, search });

            const response = await api.get(`/api/ledger?${params.toString()}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "An error occured");
        }
    }
);

export const fetchSingleLedger = createAsyncThunk(
    "ledger/fetchSingle",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/ledger/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "An error occured");
        }
    }
);

const ledgerSlice = createSlice({
    name: "ledger",
    initialState: {
        ledgers: null,
        singleLedger: null,
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearLedgerState: (state) => {
            state.error = null;
            state.success = null;
            state.loading = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createLedger.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createLedger.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
            })
            .addCase(createLedger.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch
            .addCase(fetchLedgers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(fetchLedgers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
                state.ledgers = action.payload;

            })
            .addCase(fetchLedgers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Single 
            .addCase(fetchSingleLedger.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(fetchSingleLedger.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
                state.singleLedger = action.payload;

            })
            .addCase(fetchSingleLedger.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearLedgerState } = ledgerSlice.actions;
export default ledgerSlice.reducer;
