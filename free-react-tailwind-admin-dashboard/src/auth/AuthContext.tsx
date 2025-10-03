import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthContextType, AuthUser } from './authTypes';
import { authService } from './AuthService';
import { authApiService } from '../api/services/authService';

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: { user: AuthUser | null; token: string | null } };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };

    case 'INITIALIZE':
      return {
        ...state,
        isAuthenticated: !!action.payload.token && !!action.payload.user,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const user = authService.getUser();
      const token = authService.getToken();

      dispatch({
        type: 'INITIALIZE',
        payload: { user, token }
      });
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await authApiService.login({ username, password });

      // Store auth data
      authService.setAuth(response);

      // Update context state
      const user = authService.getUser();
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: user!,
          token: response.access_token
        }
      });

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw authService.handleAuthError(error);
    }
  };

  // Logout function
  const logout = (): void => {
    // Optional: Call logout API endpoint if your backend has one
    try {
      authApiService.logout().catch(() => {
        // Ignore logout API errors, still clear local state
      });
    } catch {
      // Ignore errors, continue with logout
    }

    // Clear auth data
    authService.clearAuth();

    // Update context state
    dispatch({ type: 'LOGOUT' });
  };

  // Set loading function
  const setLoading = (loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    setLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;