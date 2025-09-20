import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import examsAPI from '../api/examsAPI';

const useExamsStore = create(devtools((set, get) => ({
  // State
  exams: [],
  selectedExam: null,
  loading: false,
  error: null,
  
  // Filter options
  filterOptions: {
    streams: [],
    examMonths: []
  },
  
  // Statistics
  stats: {
    totalExams: 0,
    examsByStream: [],
    examsByMonth: []
  },
  
  // Filters
  filters: {
    search: '',
    streams: 'all',
    examMonth: 'all'
  },
  
  // Actions
  
  /**
   * Set loading state
   */
  setLoading: (loading) => set(() => ({ loading })),
  
  /**
   * Set error state
   */
  setError: (error) => set(() => ({ error })),
  
  /**
   * Clear error state
   */
  clearError: () => set(() => ({ error: null })),
  
  /**
   * Fetch all exams (for client-side filtering)
   */
  fetchAllExams: async () => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const response = await examsAPI.getAllExams({ limit: 10000 });
      
      if (response.success) {
        set(() => ({
          exams: response.data.exams,
          loading: false,
          error: null
        }));
      } else {
        set(() => ({
          loading: false,
          error: response.message || 'Failed to fetch exams'
        }));
      }
    } catch (error) {
      set(() => ({
        loading: false,
        error: error.message || 'Failed to fetch exams'
      }));
    }
  },
  
  /**
   * Fetch exam by ID
   */
  fetchExamById: async (id) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const response = await examsAPI.getExamById(id);
      
      if (response.success) {
        set(() => ({
          selectedExam: response.data.exam,
          loading: false,
          error: null
        }));
      } else {
        set(() => ({
          loading: false,
          error: response.message || 'Failed to fetch exam'
        }));
      }
    } catch (error) {
      set(() => ({
        loading: false,
        error: error.message || 'Failed to fetch exam'
      }));
    }
  },
  
  /**
   * Fetch filter options
   */
  fetchFilterOptions: async () => {
    try {
      const response = await examsAPI.getFilterOptions();
      
      if (response.success) {
        set((state) => ({
          filterOptions: {
            ...state.filterOptions,
            ...response.data
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  },
  
  /**
   * Fetch exam statistics
   */
  fetchStats: async () => {
    try {
      const response = await examsAPI.getExamStats();
      
      if (response.success) {
        set(() => ({ stats: response.data }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },
  
  /**
   * Update filters
   */
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },
  
  /**
   * Reset filters
   */
  resetFilters: () => {
    set(() => ({
      filters: {
        search: '',
        streams: 'all',
        examMonth: 'all'
      }
    }));
  },
  
  /**
   * Get filtered exams (client-side filtering)
   */
  getFilteredExams: () => {
    const { exams, filters } = get();
    
    return exams.filter((exam) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          exam.name.toLowerCase().includes(searchLower) ||
          (exam.shortName && exam.shortName.toLowerCase().includes(searchLower)) ||
          (exam.description && exam.description.toLowerCase().includes(searchLower)) ||
          (exam.syllabus && exam.syllabus.some(subject => 
            subject.toLowerCase().includes(searchLower)
          ));
        
        if (!matchesSearch) return false;
      }
      
      // Streams filter
      if (filters.streams && filters.streams !== 'all') {
        if (!exam.streams || !exam.streams.includes(filters.streams)) {
          return false;
        }
      }
      
      // Exam month filter
      if (filters.examMonth && filters.examMonth !== 'all') {
        if (!exam.examMonth || 
            !exam.examMonth.toLowerCase().includes(filters.examMonth.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  /**
   * Clear selected exam
   */
  clearSelectedExam: () => set(() => ({ selectedExam: null })),
  
  /**
   * Reset entire store
   */
  reset: () => set(() => ({
    exams: [],
    selectedExam: null,
    loading: false,
    error: null,
    filterOptions: {
      streams: [],
      examMonths: []
    },
    stats: {
      totalExams: 0,
      examsByStream: [],
      examsByMonth: []
    },
    filters: {
      search: '',
      streams: 'all',
      examMonth: 'all'
    }
  }))
}), {
  name: 'exams-store',
  partialize: (state) => ({
    filters: state.filters
  })
}));

export default useExamsStore;