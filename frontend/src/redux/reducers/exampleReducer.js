import { createReducer } from "@reduxjs/toolkit";
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../types/exampleTypes";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(LOGIN_SUCCESS, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase(LOGIN_FAIL, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(LOGOUT, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
});

export default authReducer;
