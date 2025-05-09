import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import portfolioReducer from "./slices/portfolioSlice";
import projectReducer from "./slices/projectSlice";
import appliedJobsReducer from "./slices/appliedJobsSlice";
import proposalsReducer from "./slices/proposalsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        job: jobReducer,
        project: projectReducer,
        portfolio: portfolioReducer,
        appliedJobs: appliedJobsReducer,
        proposals: proposalsReducer,
    },
});

export default store;
