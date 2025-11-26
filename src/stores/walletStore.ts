import { create } from 'zustand';
import api from '../services/api';
import { WalletState } from '../types';

interface ExtendedWalletState extends WalletState {
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
}

export const useWalletStore = create<ExtendedWalletState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,

  loadBalance: async () => {
    try {
      const res = await api.get('/wallet/balance');
      set({ balance: res.data.balance });
    } catch (err) {
      console.error("Failed to load balance", err);
    }
  },

  loadTransactions: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/wallet/transactions');
      set({ transactions: res.data });
    } catch (err) {
      console.error("Failed to load transactions", err);
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
      console.error("Transfer failed", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deposit: async (amount) => {
    set({ isLoading: true });
    try {
      await api.post('/wallet/deposit', { amount });
      await get().loadBalance();
      await get().loadTransactions();
    } catch (err) {
      console.error("Deposit failed", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  withdraw: async (amount) => {
    set({ isLoading: true });
    try {
      await api.post('/wallet/withdraw', { amount });
      await get().loadBalance();
      await get().loadTransactions();
    } catch (err) {
      console.error("Withdrawal failed", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
