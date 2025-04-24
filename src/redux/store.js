import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ledgerReducer from './slices/ledgerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ledger: ledgerReducer,
    },
});
