import { create } from 'zustand';
import api from '../services/api';
import { AuthState } from '../types';

interface ExtendedAuthState extends AuthState {
  error: string | null;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // Check if user is already authenticated (on app load)
  checkAuth: async () => {
    const token = localStorage.getItem('sentinel_token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Auth check failed", error);
      localStorage.removeItem('sentinel_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Demo login (uses default credentials)
  login: async () => {
    // Prevent duplicate requests if already loading
    if (get().isLoading) {
      console.warn('Login already in progress');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Try to login with demo credentials, or register if not exists
      try {
        const res = await api.post('/auth/login', {
          email: 'demo@sentinelpay.io',
          password: 'password123'
        });
        localStorage.setItem('sentinel_token', res.data.token);
        set({ user: res.data.user, isAuthenticated: true, isLoading: false, error: null });
      } catch (loginError: any) {
        // If login fails, try to register
        if (loginError.response?.status === 401) {
          const res = await api.post('/auth/register', {
            email: 'demo@sentinelpay.io',
            password: 'password123',
            name: 'Alex Sentinel'
          });
          localStorage.setItem('sentinel_token', res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false, error: null });
        } else {
          throw loginError;
        }
      }
    } catch (error: any) {
      console.error("Login failed", error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Login with specific credentials
  loginWithCredentials: async (email: string, password: string): Promise<boolean> => {
    // Prevent duplicate requests if already loading
    if (get().isLoading) {
      console.warn('Login already in progress');
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('sentinel_token', res.data.token);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false, error: null });
      return true; // Return success
    } catch (error: any) {
      console.error("Login failed", error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      set({ isLoading: false, error: errorMessage, isAuthenticated: false, user: null });
      return false; // Return failure
    }
  },

  // Register new user
  register: async (email: string, password: string, name?: string): Promise<boolean> => {
    // Prevent duplicate requests if already loading
    if (get().isLoading) {
      console.warn('Registration already in progress');
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { email, password, name });
      localStorage.setItem('sentinel_token', res.data.token);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } catch (error: any) {
      console.error("Registration failed", error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('sentinel_token');
    set({ user: null, isAuthenticated: false, error: null });
  },
}));
