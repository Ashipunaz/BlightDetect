import axios from 'axios';
import { store } from '../store/store';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Prediction endpoints
export const predictionAPI = {
  uploadImage: (formData) => api.post('/predictions/upload', formData),
  getPredictions: () => api.get('/predictions'),
  deletePrediction: (id) => api.delete(`/predictions/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllPredictions: () => api.get('/admin/predictions'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deletePrediction: (id) => api.delete(`/admin/predictions/${id}`),
};

export default api; 