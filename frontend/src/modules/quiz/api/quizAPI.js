import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api';

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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-store');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Quiz API Service
 * Handles all quiz-related API calls
 */
export const quizAPI = {
  /**
   * Get Class 10 stream selection quiz
   * @returns {Promise<Object>} Quiz data with questions
   */
  getClass10Quiz: async () => {
    try {
      const response = await api.get('/quiz/class10');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz');
    }
  },

  /**
   * Submit Class 10 quiz answers
   * @param {Object} submission - Quiz submission data
   * @param {string} submission.quizId - Quiz ID
   * @param {Array<string>} submission.answers - Array of user answers
   * @param {string} submission.userId - User ID (optional)
   * @returns {Promise<Object>} Quiz results with AI recommendations
   */
  submitClass10Quiz: async (submission) => {
    try {
      const response = await api.post('/quiz/class10/submit', submission);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  },

  /**
   * Get available quizzes for a specific class
   * @param {string} targetClass - Target class ('10' or '12')
   * @returns {Promise<Object>} List of available quizzes
   */
  getAvailableQuizzes: async (targetClass) => {
    try {
      const response = await api.get(`/quiz/available/${targetClass}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available quizzes');
    }
  },

  /**
   * Test Gemini AI connection
   * @returns {Promise<Object>} Connection status
   */
  testGeminiConnection: async () => {
    try {
      const response = await api.get('/quiz/test-gemini');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to test Gemini connection');
    }
  },

  /**
   * Get Class 12 PCM field recommendation quiz
   * @returns {Promise<Object>} Quiz data with questions
   */
  getClass12PCMQuiz: async () => {
    try {
      const response = await api.get('/quiz/class12/pcm');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch Class 12 PCM quiz');
    }
  },

  /**
   * Submit Class 12 PCM quiz answers
   * @param {Object} submission - Quiz submission data
   * @param {string} submission.quizId - Quiz ID
   * @param {Array<string>} submission.answers - Array of user answers
   * @param {string} submission.userId - User ID (optional)
   * @returns {Promise<Object>} Quiz results with AI field recommendations
   */
  submitClass12PCMQuiz: async (submission) => {
    try {
      const response = await api.post('/quiz/class12/pcm/submit', submission);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit Class 12 PCM quiz');
    }
  },

  /**
   * Get Class 12 PCB field recommendation quiz
   * @returns {Promise<Object>} Quiz data with questions
   */
  getClass12PCBQuiz: async () => {
    try {
      const response = await api.get('/quiz/class12/pcb');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch Class 12 PCB quiz');
    }
  },

  /**
   * Submit Class 12 PCB quiz answers
   * @param {Object} submission - Quiz submission data
   * @param {string} submission.quizId - Quiz ID
   * @param {Array<string>} submission.answers - Array of user answers
   * @param {string} submission.userId - User ID (optional)
   * @returns {Promise<Object>} Quiz results with AI field recommendations
   */
  submitClass12PCBQuiz: async (submission) => {
    try {
      const response = await api.post('/quiz/class12/pcb/submit', submission);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit Class 12 PCB quiz');
    }
  },

  /**
   * Get Class 12 Commerce field recommendation quiz
   * @returns {Promise<Object>} Quiz data with questions
   */
  getClass12CommerceQuiz: async () => {
    try {
      const response = await api.get('/quiz/class12/commerce');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch Class 12 Commerce quiz');
    }
  },

  /**
   * Submit Class 12 Commerce quiz answers
   * @param {Object} submission - Quiz submission data
   * @param {string} submission.quizId - Quiz ID
   * @param {Array<string>} submission.answers - Array of user answers
   * @param {string} submission.userId - User ID (optional)
   * @returns {Promise<Object>} Quiz results with AI field recommendations
   */
  submitClass12CommerceQuiz: async (submission) => {
    try {
      const response = await api.post('/quiz/class12/commerce/submit', submission);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit Class 12 Commerce quiz');
    }
  },

  /**
   * Get Class 12 Arts field recommendation quiz
   * @returns {Promise<Object>} Quiz data with questions
   */
  getClass12ArtsQuiz: async () => {
    try {
      const response = await api.get('/quiz/class12/arts');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch Class 12 Arts quiz');
    }
  },

  /**
   * Submit Class 12 Arts quiz answers
   * @param {Object} submission - Quiz submission data
   * @param {string} submission.quizId - Quiz ID
   * @param {Array<string>} submission.answers - Array of user answers
   * @param {string} submission.userId - User ID (optional)
   * @returns {Promise<Object>} Quiz results with AI field recommendations
   */
  submitClass12ArtsQuiz: async (submission) => {
    try {
      const response = await api.post('/quiz/class12/arts/submit', submission);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit Class 12 Arts quiz');
    }
  }
};