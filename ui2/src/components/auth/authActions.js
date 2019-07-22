import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  GET_DEP_ROLE_REQUEST,
  GET_DEP_ROLE_SUCCESS,
  GET_DEP_ROLE_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOUGOUT,
  APP_INIT,
} from '../../actions';
import * as API from '../../api/api';

export const signup = userDetails => {
  return async dispatch => {
    dispatch({
      type: SIGNUP_REQUEST,
    });
    try {
      const data = await API.signup(userDetails);
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SIGNUP_FAILURE,
        error,
      });
      throw error;
    }
  };
};

export const login = userDetails => {
  return async dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
    });
    try {
      const data = await API.login(userDetails);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        error,
      });
      throw error;
    }
  };
};

export const logout = () => {
  return dispatch => {
    API.appLogout();
    dispatch({
      type: LOUGOUT,
    });
  };
};

export const appInit = () => {
  return dispatch => {
    const loggedIn = API.appInit();
    dispatch({
      type: APP_INIT,
      payload: loggedIn,
    });
  };
};

export const getDeploymentRoles = () => {
  return async dispatch => {
    dispatch({
      type: GET_DEP_ROLE_REQUEST,
    });
    try {
      const data = await API.getDeploymentRoles();
      dispatch({
        type: GET_DEP_ROLE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_DEP_ROLE_FAILURE,
        error,
      });
    }
  };
};
