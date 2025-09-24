'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '@/lib/client';
import {
  getErrorMessage,
  getSuccessMessage,
  getResponseData,
  isApiSuccess,
} from '@/lib/helper';
import { message } from 'antd';

// Initial state
const initialState = {
  user: null,
  token: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  TOKEN_REFRESH_SUCCESS: 'TOKEN_REFRESH_SUCCESS',
  TOKEN_REFRESH_FAILURE: 'TOKEN_REFRESH_FAILURE',
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        sessionId: action.payload.sessionId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        sessionId: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.TOKEN_REFRESH_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        sessionId: action.payload.sessionId,
        error: null,
      };

    case AUTH_ACTIONS.TOKEN_REFRESH_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  SESSION_ID: 'auth_session_id',
};

// AuthProvider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

        if (token && user) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token,
              user: JSON.parse(user),
              sessionId,
            },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        clearAuthData();
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadAuthData();
  }, []);

  // Save auth data to localStorage
  const saveAuthData = (token, user, sessionId) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      if (sessionId) {
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
      }
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  // Clear auth data from localStorage
  const clearAuthData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await api.post(
        '/inspections-and-ukk/auth/login',
        credentials
      );
      console.log(response);
      if (isApiSuccess(response)) {
        const data = getResponseData(response);
        const successMessage = getSuccessMessage(response);

        // Extract user, token, and session data from Laravel response
        const { user, token, session_id } = data;

        // Save to localStorage
        saveAuthData(token, user, session_id);

        // Update state
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user,
            token,
            sessionId: session_id,
          },
        });

        // Show success message
        message.success(successMessage || 'Login berhasil!');

        return { success: true, data };
      } else {
        throw new Error('Login response indicates failure');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      message.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async (showMessage = true) => {
    try {
      // Call logout API if token exists
      if (state.token) {
        await api.post('/inspections-and-ukk/auth/logout');
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local data
      clearAuthData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      if (showMessage) {
        message.success('Logout berhasil!');
      }
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await api.post('/inspections-and-ukk/auth/refresh');

      if (isApiSuccess(response)) {
        const data = getResponseData(response);
        const { token, session_id } = data;

        // Update localStorage
        saveAuthData(token, state.user, session_id);

        // Update state
        dispatch({
          type: AUTH_ACTIONS.TOKEN_REFRESH_SUCCESS,
          payload: {
            token,
            sessionId: session_id,
          },
        });

        return { success: true, token };
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      dispatch({
        type: AUTH_ACTIONS.TOKEN_REFRESH_FAILURE,
        payload: errorMessage,
      });

      // If refresh fails, logout user
      await logout(false);
      throw error;
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };

    // Update localStorage
    saveAuthData(state.token, updatedUser, state.sessionId);

    // Update state
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has specific role
  const hasRole = (roleName) => {
    if (!state.user || !state.user.roles) return false;
    return state.user.roles.some((role) => role.role === roleName);
  };

  // Check if user has specific role position
  const hasRolePosition = (position) => {
    if (!state.user || !state.user.roles) return false;
    return state.user.roles.some((role) => role.role_position === position);
  };

  // Get user's primary role
  const getPrimaryRole = () => {
    if (!state.user || !state.user.roles || state.user.roles.length === 0) {
      return null;
    }
    return state.user.roles[0];
  };

  // Context value
  const value = {
    // State
    ...state,

    // Actions
    login,
    logout,
    refreshToken,
    updateUser,
    clearError,

    // Utility functions
    hasRole,
    hasRolePosition,
    getPrimaryRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// HOC for protected routes
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>; // You can replace with a proper loading component
    }

    if (!isAuthenticated) {
      // Redirect to login or show unauthorized message
      return <div>Unauthorized</div>; // You can replace with proper redirect logic
    }

    return <Component {...props} />;
  };
}

export default AuthContext;
