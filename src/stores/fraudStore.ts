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
      // Set defaults if API fails
      set({
        alerts: [],
        riskScore: { score: 0, level: 'safe', trend: 'stable' },
        device: { deviceId: 'unknown', model: 'Unknown', ip: '0.0.0.0', risk: 'low' }
      });
    } finally {
      set({ isLoading: false });
    }
  },

  explainRisk: async () => {
    set({ isLoading: true });
    try {
      const res = await api.post('/fraud/explain');
      set({ explanation: res.data.explanation });
    } catch (err) {
      console.error("Failed to get explanation", err);
      set({ explanation: "Unable to generate explanation. Please try again later." });
    } finally {
      set({ isLoading: false });
    }
  }
}));
