import { create } from 'zustand';
import api from '../services/api';
import { WalletState } from '../types';

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,

  loadBalance: async () => {
    try {
      const res = await api.get('/wallet/balance');
      set({ balance: res.data.balance });
    } catch (err) {
      console.error(err);
    }
  },

  loadTransactions: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/wallet/transactions');
      set({ transactions: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  transfer: async (amount, recipient) => {
    set({ isLoading: true });
    try {
      await api.post('/wallet/transfer', { amount, recipient });
      // Refresh data
      await get().loadBalance();
      await get().loadTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  }
}));