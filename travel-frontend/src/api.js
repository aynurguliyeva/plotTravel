import axios from 'axios';

// This looks for an environment variable, otherwise falls back to localhost
const api = axios.create({
 baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;