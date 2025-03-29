import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import predictionReducer from './slices/predictionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    predictions: predictionReducer,
  },
}); 