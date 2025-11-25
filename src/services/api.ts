import axios from 'axios';
import { loginResponse } from '../mock/auth';
import { mockBalance, mockTransactions } from '../mock/wallet';
import { mockAlerts, mockDevice, mockExplanation, mockRiskScore } from '../mock/fraud';
import { mockPaymentHistory } from '../mock/payments';

// Base Axios instance
const api = axios.create({
  baseURL: 'https://api.sentinelpay.io/v1', // Fictional base URL
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Mocking Auth Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sentinel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (MOCKING THE BACKEND)
// In a real app, this would be removed. Here we hijack calls to return mock data.
api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    // Determine the endpoint from error.config.url
    const url = error.config?.url;
    const method = error.config?.method;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (url === '/auth/login' && method === 'post') {
      return { data: loginResponse };
    }
    
    if (url === '/auth/me' && method === 'get') {
      return { data: loginResponse.user };
    }

    if (url === '/wallet/balance' && method === 'get') {
      return { data: { balance: mockBalance } };
    }

    if (url === '/wallet/transactions' && method === 'get') {
      return { data: mockTransactions };
    }

    if (url === '/wallet/transfer' && method === 'post') {
      return { data: { success: true, message: 'Transfer successful' } };
    }

    if (url === '/payments/checkout' && method === 'post') {
      return { data: { success: true, transactionId: 'tx_new_999' } };
    }

    if (url === '/payments/history' && method === 'get') {
      return { data: mockPaymentHistory };
    }

    if (url === '/fraud/alerts' && method === 'get') {
      return { data: mockAlerts };
    }

    if (url === '/fraud/risk-score' && method === 'get') {
      return { data: mockRiskScore };
    }

    if (url === '/fraud/device' && method === 'get') {
      return { data: mockDevice };
    }

    if (url === '/fraud/explain' && method === 'post') {
      return { data: mockExplanation };
    }

    // Default error if no mock matched
    return Promise.reject(error);
  }
);

export default api;