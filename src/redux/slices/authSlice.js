import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../config/vars";

const { baseURL } = config;

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/api/auth/login`, {
                email,
                password,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/api/auth/signup`, {
                email,
                password,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Signup failed");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("token"),
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
        clearAuthState: (state) => {
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // SIGNUP
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
