import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Get all colleges with optional filters
export const getAllColleges = async (params = {}) => {
  try {
    const response = await api.get('/colleges', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch colleges');
  }
};

// Get college by ID
export const getCollegeById = async (id) => {
  try {
    const response = await api.get(`/colleges/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch college details');
  }
};

// Get filter options
export const getCollegeFilters = async () => {
  try {
    const response = await api.get('/colleges/filters');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch filter options');
  }
};

// Get college statistics
export const getCollegeStats = async () => {
  try {
    const response = await api.get('/colleges/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch college statistics');
  }
};

// Search colleges with text query
export const searchColleges = async (searchQuery, filters = {}) => {
  try {
    const params = {
      search: searchQuery,
      ...filters
    };
    const response = await api.get('/colleges', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search colleges');
  }
};

export default {
  getAllColleges,
  getCollegeById,
  getCollegeFilters,
  getCollegeStats,
  searchColleges
};