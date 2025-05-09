import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import portfolioReducer from "./slices/portfolioSlice";
import projectReducer from "./slices/projectSlice";
import appliedJobsReducer from "./slices/appliedJobsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        job: jobReducer,
        project: projectReducer,
        portfolio: portfolioReducer,
        appliedJobs: appliedJobsReducer,
    },
});

export default store;
