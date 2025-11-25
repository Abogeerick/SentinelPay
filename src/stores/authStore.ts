import { create } from 'zustand';
import api from '../services/api';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      const res = await api.post('/auth/login', { email: 'demo@user.com', password: 'password' });
      localStorage.setItem('sentinel_token', res.data.token);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Login failed", error);
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('sentinel_token');
    set({ user: null, isAuthenticated: false });
  },
}));