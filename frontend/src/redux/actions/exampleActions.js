import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../types/exampleTypes";

export const login = (userData) => {
  return (dispatch) => {
    try {
      dispatch({ type: LOGIN_SUCCESS, payload: userData });
    } catch (error) {
      dispatch({ type: LOGIN_FAIL });
    }
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
