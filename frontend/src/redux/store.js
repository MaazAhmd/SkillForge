import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import portfolioReducer from './slices/portfolioSlice';
import chatReducer from './slices/chatSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    portfolio: portfolioReducer,
    chat: chatReducer,
  },
});

export default store;
