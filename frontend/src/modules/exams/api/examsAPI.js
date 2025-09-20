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

// Get all exams with optional filters
export const getAllExams = async (params = {}) => {
  try {
    const response = await api.get('/exams', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch exams');
  }
};

// Get exam by ID
export const getExamById = async (id) => {
  try {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch exam');
  }
};

// Get filter options for exams
export const getFilterOptions = async () => {
  try {
    const response = await api.get('/exams/filters');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch filter options');
  }
};

// Get exam statistics
export const getExamStats = async () => {
  try {
    const response = await api.get('/exams/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch exam statistics');
  }
};

// Create a new exam (admin only)
export const createExam = async (examData) => {
  try {
    const response = await api.post('/exams', examData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create exam');
  }
};

// Update exam by ID (admin only)
export const updateExam = async (id, examData) => {
  try {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update exam');
  }
};

// Delete exam by ID (admin only)
export const deleteExam = async (id) => {
  try {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete exam');
  }
};

export default {
  getAllExams,
  getExamById,
  getFilterOptions,
  getExamStats,
  createExam,
  updateExam,
  deleteExam
};