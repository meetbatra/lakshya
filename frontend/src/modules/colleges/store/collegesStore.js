import collegesAPI from '../api/collegesAPI';

// Direct API functions without state management
export const useCollegesStore = {
  // Fetch all colleges directly
  fetchAllColleges: async () => {
    try {
      const params = {
        limit: 10000, // Large number to get all colleges
        sortBy: 'name',
        sortOrder: 'asc'
      };
      
      const response = await collegesAPI.getAllColleges(params);
      
      if (response.success) {
        return { success: true, data: response.data.colleges };
      } else {
        return { success: false, error: response.message || 'Failed to fetch colleges' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch college by ID directly
  fetchCollegeById: async (id) => {
    try {
      const response = await collegesAPI.getCollegeById(id);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Failed to fetch college' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch filter options directly
  fetchFilterOptions: async () => {
    try {
      const response = await collegesAPI.getCollegeFilters();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Failed to fetch filter options' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch statistics directly
  fetchStats: async () => {
    try {
      const response = await collegesAPI.getCollegeStats();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Failed to fetch college stats' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Client-side filtering utility functions
  filterColleges: (colleges, filters) => {
    const { searchQuery, type, state, city } = filters;
    
    return colleges.filter(college => {
      // Type filter
      const matchesType = type === 'all' || college.type === type;
      
      // State filter
      const matchesState = state === 'all' || college.location?.state === state;
      
      // City filter
      const matchesCity = city === 'all' || college.location?.city === city;
      
      // Search filter - search across multiple fields
      const matchesSearch = !searchQuery || (() => {
        const query = searchQuery.toLowerCase();
        
        // Basic college info
        const basicMatch = college.name?.toLowerCase().includes(query) ||
                          college.shortName?.toLowerCase().includes(query) ||
                          college.location?.city?.toLowerCase().includes(query) ||
                          college.location?.state?.toLowerCase().includes(query) ||
                          college.type?.toLowerCase().includes(query);
        
        // Course search within college
        const courseMatch = college.courses?.some(course => 
          course.courseId?.name?.toLowerCase().includes(query) ||
          course.courseId?.shortName?.toLowerCase().includes(query) ||
          course.field?.toLowerCase().includes(query)
        );
        
        return basicMatch || courseMatch;
      })();
      
      return matchesType && matchesState && matchesCity && matchesSearch;
    });
  },

  // Get unique filter values from colleges data
  getFilterOptions: (colleges) => {
    const states = [...new Set(colleges.map(college => college.location?.state).filter(Boolean))];
    const types = [...new Set(colleges.map(college => college.type).filter(Boolean))];
    const cities = [...new Set(colleges.map(college => college.location?.city).filter(Boolean))];
    
    return { states, types, cities };
  }
};