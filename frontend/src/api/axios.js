import axios from 'axios';

// In development, VITE_API_URL is empty so all requests go through
// the Vite dev server proxy (/api → http://localhost:5000).
// In production, set VITE_API_URL to the deployed backend URL.
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'Request timed out' : 'Network error occurred');
    return Promise.reject(new Error(message));
  }
);

export default api;
