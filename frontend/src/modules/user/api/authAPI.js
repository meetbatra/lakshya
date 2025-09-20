import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api'; // Updated to match backend port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand persisted store
    const authStore = JSON.parse(localStorage.getItem('auth-store') || '{}');
    const token = authStore.state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - Zustand logout will be handled by the calling component
      console.log('Unauthorized - token may be expired');
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    }
    // No need to remove token from localStorage since Zustand handles it
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Verify token and get user data
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/profile');
      return {
        user: response.data.data.user
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  },

  // Update user profile
  updateProfile: async (updateData) => {
    try {
      const response = await api.put('/auth/profile', updateData);
      return {
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Google OAuth login
  googleLogin: async (credential) => {
    try {
      const response = await api.post('/auth/google', { credential });
      return response.data.data; // Return the data object containing user, token, and requiresProfileCompletion
    } catch (error) {
      throw error;
    }
  }
};

export default api;
