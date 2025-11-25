import { create } from 'zustand';
import api from '../services/api';
import { FraudState } from '../types';

export const useFraudStore = create<FraudState>((set) => ({
  alerts: [],
  riskScore: null,
  device: null,
  explanation: null,
  isLoading: false,

  loadFraudData: async () => {
    set({ isLoading: true });
    try {
      const [alertsRes, riskRes, deviceRes] = await Promise.all([
        api.get('/fraud/alerts'),
        api.get('/fraud/risk-score'),
        api.get('/fraud/device'),
      ]);

      set({
        alerts: alertsRes.data,
        riskScore: riskRes.data,
        device: deviceRes.data,
      });
    } catch (err) {
      console.error("Failed to load fraud data", err);
    } finally {
      set({ isLoading: false });
    }
  },

  explainRisk: async () => {
    // Only fetch if we don't have it (or force refresh)
    set({ isLoading: true });
    try {
      const res = await api.post('/fraud/explain');
      set({ explanation: res.data.explanation });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  }
}));