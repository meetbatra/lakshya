import examsAPI from '../api/examsAPI';

// Direct API functions without state management
const useExamsStore = {
  // Fetch all exams directly
  fetchAllExams: async () => {
    try {
      const response = await examsAPI.getAllExams({ limit: 10000 });
      
      if (response.success) {
        return { success: true, data: response.data.exams };
      } else {
        return { success: false, error: response.message || 'Failed to fetch exams' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch exams' };
    }
  },

  // Fetch exam by ID directly
  fetchExamById: async (id) => {
    try {
      const response = await examsAPI.getExamById(id);
      
      if (response.success) {
        return { success: true, data: response.data.exam };
      } else {
        return { success: false, error: response.message || 'Failed to fetch exam' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch exam' };
    }
  },

  // Fetch filter options directly
  fetchFilterOptions: async () => {
    try {
      const response = await examsAPI.getFilterOptions();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Failed to fetch filter options' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch filter options' };
    }
  },

  // Fetch exam statistics directly
  fetchStats: async () => {
    try {
      const response = await examsAPI.getExamStats();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Failed to fetch stats' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch stats' };
    }
  },

  // Client-side filtering utility functions
  filterExams: (exams, filters) => {
    const { search, streams } = filters;
    
    return exams.filter((exam) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
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
      if (streams && streams !== 'all') {
        if (!exam.streams || !exam.streams.includes(streams)) {
          return false;
        }
      }
      
      return true;
    });
  },

  // Get unique streams from exams data
  getAvailableStreams: (exams) => {
    const streamSet = new Set();
    exams.forEach(exam => {
      if (exam.streams) {
        exam.streams.forEach(stream => streamSet.add(stream));
      }
    });
    return Array.from(streamSet);
  }
};

export default useExamsStore;