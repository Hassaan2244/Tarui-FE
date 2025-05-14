import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

// Create Bill Setting
export const createSetting = createAsyncThunk(
    "setting/create",
    async ({ icon, name, email, phone, address }, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/bill-setting", { icon, name, email, phone, address });
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.response?.message || "An error occurred"
            );
        }
    }
);

// Update Bill Setting
export const updateSetting = createAsyncThunk(
    "setting/update",
    async ({ icon, name, email, phone, address, id }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/api/bill-setting/${id}`, { icon, name, email, phone, address });
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.response?.message || "An error occurred"
            );
        }
    }
);

// Fetch Bill Setting
export const fetchSetting = createAsyncThunk(
    "setting/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/bill-setting");
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.response?.message || "An error occurred"
            );
        }
    }
);

// Slice
const settingSlice = createSlice({
    name: "setting",
    initialState: {
        setting: null,
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearSettingState: (state) => {
            state.error = null;
            state.success = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createSetting.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSetting.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.setting = action.payload.data;
            })
            .addCase(createSetting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updateSetting.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSetting.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.setting = action.payload.data;
            })
            .addCase(updateSetting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FETCH
            .addCase(fetchSetting.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSetting.fulfilled, (state, action) => {
                state.loading = false;
                state.setting = action.payload.data;
            })
            .addCase(fetchSetting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSettingState } = settingSlice.actions;
export default settingSlice.reducer;
