import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import portfolioReducer from "./slices/portfolioSlice";
import projectReducer from "./slices/projectSlice";
import appliedJobsReducer from "./slices/appliedJobsSlice";
import proposalsReducer from "./slices/proposalsSlice";
import clientJobsReducer from "./slices/clientJobsSlice";
import accountReducer from "./slices/accountSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        job: jobReducer,
        project: projectReducer,
        portfolio: portfolioReducer,
        appliedJobs: appliedJobsReducer,
        proposals: proposalsReducer,
        clientJobs: clientJobsReducer,
        account: accountReducer,
    },
});

export default store;
