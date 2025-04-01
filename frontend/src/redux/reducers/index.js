import { combineReducers } from "redux";
import authReducer from "./exampleReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
});
