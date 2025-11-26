import axios from 'axios';

// Base Axios instance - pointing to real backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Real backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add Auth Token
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

// Response Interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('sentinel_token');
      // Could trigger a redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api;
