import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/vars";
import api from "../../config/api";

const { baseURL } = config;

export const getStats = createAsyncThunk(
    "stat/getStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${baseURL}/api/stats/transactions`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.message || "Error while getting stats");
        }
    }
);


const statSlice = createSlice({
    name: "stats",
    initialState: {
        recentTransactions: [],
        highestLedgers: [],
        lowestLedgers: [],
        totalPositiveBalance: 0,
        totalNegativeBalance: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearStats: (state) => {
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get stats
            .addCase(getStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                const {
                    recentTransactions,
                    highestLedgers,
                    lowestLedgers,
                    totalPositiveBalance,
                    totalNegativeBalance
                } = action.payload.data;

                state.recentTransactions = recentTransactions;
                state.highestLedgers = highestLedgers;
                state.lowestLedgers = lowestLedgers;
                state.totalPositiveBalance = totalPositiveBalance;
                state.totalNegativeBalance = totalNegativeBalance;
                state.loading = false;
            })
            .addCase(getStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export const { clearStats } = statSlice.actions;
export default statSlice.reducer;
