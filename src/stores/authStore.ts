import { create } from 'zustand';
import api from '../services/api';
import { AuthState } from '../types';

interface ExtendedAuthState extends AuthState {
  register: (email: string, password: string, name?: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<ExtendedAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

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
    set({ isLoading: true });
    try {
      // Try to login with demo credentials, or register if not exists
      try {
        const res = await api.post('/auth/login', { 
          email: 'demo@sentinelpay.io', 
          password: 'password123' 
        });
        localStorage.setItem('sentinel_token', res.data.token);
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      } catch (loginError: any) {
        // If login fails, try to register
        if (loginError.response?.status === 401) {
          const res = await api.post('/auth/register', {
            email: 'demo@sentinelpay.io',
            password: 'password123',
            name: 'Alex Sentinel'
          });
          localStorage.setItem('sentinel_token', res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } else {
          throw loginError;
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      set({ isLoading: false });
    }
  },

  // Login with specific credentials
  loginWithCredentials: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('sentinel_token', res.data.token);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Login failed", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Register new user
  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', { email, password, name });
      localStorage.setItem('sentinel_token', res.data.token);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Registration failed", error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('sentinel_token');
    set({ user: null, isAuthenticated: false });
  },
}));
