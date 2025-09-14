import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/courses`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const coursesAPI = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch courses'
      };
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/${courseId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch course details'
      };
    }
  },

  // Get courses by stream
  getCoursesByStream: async (stream) => {
    try {
      const response = await api.get(`/stream/${stream}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching courses by stream:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch courses by stream'
      };
    }
  },

  // Get courses by field
  getCoursesByField: async (field) => {
    try {
      const response = await api.get(`/field/${field}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching courses by field:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch courses by field'
      };
    }
  },

  // Get AI recommended courses by field
  getAIRecommendedCourses: async (field) => {
    try {
      const response = await api.get(`/ai-recommended/field/${field}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching AI recommended courses:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch AI recommended courses'
      };
    }
  }
};