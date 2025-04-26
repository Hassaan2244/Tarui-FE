import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../config/vars";
import { getAuthHeaders } from "../../config/helperFunctions";

const { baseURL } = config;

export const createProduct = createAsyncThunk(
    "product/create",
    async ({ name, description, price, qty }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${baseURL}/api/product`,
                { name, description, price, qty },
                getAuthHeaders()
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "An error occurred"
            );
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ name, description, price, qty, id }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${baseURL}/api/product/${id}`,
                { name, description, price, qty },
                getAuthHeaders()
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "An error occurred"
            );
        }
    }
);

export const fetchProducts = createAsyncThunk(
    "product/fetch",
    async ({ page = 1, search = "" }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page, search });

            const response = await axios.get(
                `${baseURL}/api/product?${params.toString()}`,
                getAuthHeaders()
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "An error occurred"
            );
        }
    }
);

export const fetchSingleProduct = createAsyncThunk(
    "product/fetchSingle",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${baseURL}/api/product/${id}`,
                getAuthHeaders()
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "An error occurred"
            );
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: null,
        singleProduct: null,
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearProductState: (state) => {
            state.error = null;
            state.success = null;
            state.loading = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Edit
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.message;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Single
            .addCase(fetchSingleProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.singleProduct = action.payload;
            })
            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
