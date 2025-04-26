import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ledgerReducer from './slices/ledgerSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ledger: ledgerReducer,
        product: productReducer,
    },
});
