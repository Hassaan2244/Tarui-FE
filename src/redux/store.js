import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ledgerReducer from './slices/ledgerSlice';
import productReducer from './slices/productSlice';
import billingReducer from './slices/billingSlice';
import billSettingReducer from './slices/billSettingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ledger: ledgerReducer,
        product: productReducer,
        billing: billingReducer,
        billSetting: billSettingReducer,
    },
});
