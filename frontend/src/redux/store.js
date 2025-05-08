import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import portfolioReducer from './slices/portfolioSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    portfolio: portfolioReducer,
  },
});

export default store;
