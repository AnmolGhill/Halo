import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (idToken) => {
    const response = await api.post('/auth/login', { idToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  verifyEmail: async () => {
    const response = await api.post('/auth/verify-email');
    return response.data;
  },

  resetPassword: async (email) => {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/auth/account');
    return response.data;
  }
};

// Chatbot API calls
export const chatbotAPI = {
  chat: async (message, conversationId = null) => {
    const response = await api.post('/chatbot/chat', {
      message,
      conversationId
    });
    return response.data;
  },

  analyzeSymptoms: async (symptoms, userInfo = {}) => {
    const response = await api.post('/chatbot/analyze-symptoms', {
      symptoms,
      userInfo
    });
    return response.data;
  },

  getHealthTips: async (category = 'general') => {
    const response = await api.post('/chatbot/health-tips', { category });
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/chatbot/conversations');
    return response.data;
  },

  getConversation: async (conversationId) => {
    const response = await api.get(`/chatbot/conversations/${conversationId}`);
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/chatbot/conversations/${conversationId}`);
    return response.data;
  },

  getSymptomHistory: async () => {
    const response = await api.get('/chatbot/symptom-history');
    return response.data;
  }
};

export default api;
