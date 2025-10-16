import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  },

  // Daily Quiz APIs
  /**
   * Get today's daily quiz
   * @returns {Promise<Object>} Daily quiz data with questions and config
   */
  getDailyQuiz: async () => {
    try {
      const response = await api.get('/daily-quiz');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch daily quiz');
    }
  },

  /**
   * Submit daily quiz answers
   * @param {Object} submission - Quiz submission data
   * @param {string} submission.quizId - Quiz ID
   * @param {Array<Object>} submission.answers - Array of answer objects
   * @param {number} submission.timeTaken - Time taken in seconds
   * @returns {Promise<Object>} Quiz results and analytics
   */
  submitDailyQuiz: async (submission) => {
    try {
      const response = await api.post('/daily-quiz/submit', submission);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit daily quiz');
    }
  },

  /**
   * Get user's quiz analytics
   * @param {number} days - Number of days to analyze (default: 30)
   * @returns {Promise<Object>} User analytics data
   */
  getQuizAnalytics: async (days = 30) => {
    try {
      const response = await api.get(`/daily-quiz/analytics?days=${days}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz analytics');
    }
  },

  /**
   * Get user's quiz history
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Promise<Object>} Quiz history data
   */
  getQuizHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/daily-quiz/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz history');
    }
  },

  /**
   * Get available question counts by subject
   * @returns {Promise<Object>} Question counts and recommendations for different quiz types
   */
  getQuestionCounts: async () => {
    try {
      const response = await api.get('/daily-quiz/question-counts');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch question counts');
    }
  },

  /**
   * Get custom quiz by subjects (for JEE/NEET)
   * @param {Object} config - Quiz configuration
   * @param {Array<string>} config.subjects - Array of subjects (e.g., ['Physics', 'Chemistry', 'Mathematics'])
   * @param {number} config.questionCount - Number of questions
   * @param {string} config.difficulty - Difficulty level ('Easy', 'Medium', 'Hard', or null for mixed)
   * @param {number} config.timeLimit - Time limit in seconds
   * @returns {Promise<Object>} Custom quiz data
   */
  getCustomQuiz: async (config) => {
    try {
      const response = await api.post('/daily-quiz/custom', config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch custom quiz');
    }
  },

  /**
   * Submit custom quiz answers
   * @param {Object} quizData - Quiz submission data
   * @param {string} quizData.quizId - Quiz ID
   * @param {string} quizData.examId - Exam ID
   * @param {Array} quizData.answers - Array of answers with questionId and selectedOptionId
   * @param {string} quizData.startTime - Quiz start time (ISO string)
   * @param {string} quizData.endTime - Quiz end time (ISO string)
   * @returns {Promise<Object>} Quiz results
   */
  submitCustomQuiz: async (quizData) => {
    try {
      const response = await api.post('/daily-quiz/submit', quizData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
};