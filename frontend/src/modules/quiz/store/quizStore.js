import { create } from 'zustand';
import { quizAPI } from '../api/quizAPI';

/**
 * Quiz Store - Manages quiz state, questions, answers, and results
 */
export const useQuizStore = create((set, get) => ({
  // Quiz State
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  isLoading: false,
  error: null,
  quizResults: null,
  isQuizCompleted: false,
  isQuizStarted: false,

  // Quiz Actions
  /**
   * Start a new quiz session
   */
  startQuiz: () => {
    set({
      currentQuestionIndex: 0,
      answers: [],
      isQuizCompleted: false,
      isQuizStarted: true,
      quizResults: null,
      error: null
    });
  },

  /**
   * Fetch Class 10 quiz
   */
  fetchClass10Quiz: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await quizAPI.getClass10Quiz();
      if (response.success) {
        set({
          currentQuiz: response.data,
          isLoading: false,
          error: null
        });
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
        currentQuiz: null
      });
      throw error;
    }
  },

  /**
   * Answer current question and move to next
   * @param {string} answer - Selected answer
   */
  answerQuestion: (answer) => {
    const state = get();
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestionIndex] = answer;
    
    set({
      answers: newAnswers
    });
  },

  /**
   * Move to next question
   */
  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;
    
    if (nextIndex < state.currentQuiz?.totalQuestions) {
      set({
        currentQuestionIndex: nextIndex
      });
    }
  },

  /**
   * Move to previous question
   */
  previousQuestion: () => {
    const state = get();
    const prevIndex = state.currentQuestionIndex - 1;
    
    if (prevIndex >= 0) {
      set({
        currentQuestionIndex: prevIndex
      });
    }
  },

  /**
   * Go to specific question
   * @param {number} questionIndex - Question index to navigate to
   */
  goToQuestion: (questionIndex) => {
    const state = get();
    
    if (questionIndex >= 0 && questionIndex < state.currentQuiz?.totalQuestions) {
      set({
        currentQuestionIndex: questionIndex
      });
    }
  },

  /**
   * Submit quiz and get AI recommendations
   * @param {string} userId - Optional user ID
   */
  submitQuiz: async (userId = null) => {
    const state = get();
    
    if (!state.currentQuiz || state.answers.length !== state.currentQuiz.totalQuestions) {
      throw new Error('Please answer all questions before submitting');
    }

    set({ isLoading: true, error: null });

    try {
      const submission = {
        quizId: state.currentQuiz.id,
        answers: state.answers,
        ...(userId && { userId })
      };

      const response = await quizAPI.submitClass10Quiz(submission);
      
      if (response.success) {
        set({
          quizResults: response.data,
          isQuizCompleted: true,
          isLoading: false,
          error: null
        });
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  /**
   * Reset quiz state for new attempt
   */
  resetQuiz: () => {
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      answers: [],
      isLoading: false,
      error: null,
      quizResults: null,
      isQuizCompleted: false,
      isQuizStarted: false
    });
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },

  // Computed getters
  /**
   * Get current question
   */
  getCurrentQuestion: () => {
    const state = get();
    if (!state.currentQuiz || !state.currentQuiz.questions) return null;
    return state.currentQuiz.questions[state.currentQuestionIndex];
  },

  /**
   * Get current answer for current question
   */
  getCurrentAnswer: () => {
    const state = get();
    return state.answers[state.currentQuestionIndex] || '';
  },

  /**
   * Check if current question is answered
   */
  isCurrentQuestionAnswered: () => {
    const state = get();
    return Boolean(state.answers[state.currentQuestionIndex]);
  },

  /**
   * Get quiz progress percentage
   */
  getProgress: () => {
    const state = get();
    if (!state.currentQuiz?.totalQuestions) return 0;
    return Math.round(((state.currentQuestionIndex + 1) / state.currentQuiz.totalQuestions) * 100);
  },

  /**
   * Get number of answered questions
   */
  getAnsweredCount: () => {
    const state = get();
    return state.answers.filter(answer => answer && answer.trim() !== '').length;
  },

  /**
   * Check if quiz can be submitted
   */
  canSubmitQuiz: () => {
    const state = get();
    return state.currentQuiz && 
           state.answers.length === state.currentQuiz.totalQuestions &&
           state.answers.every(answer => answer && answer.trim() !== '');
  }
}));