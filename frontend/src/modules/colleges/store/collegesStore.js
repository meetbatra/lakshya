import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import collegesAPI from '../api/collegesAPI';

const useCollegesStore = create(devtools((set, get) => ({
  // State
  colleges: [],
  selectedCollege: null,
  loading: false,
  error: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20
  },
  
  // Filters and search
  searchQuery: '',
  filters: {
    type: 'all',
    state: 'all',
    city: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  autoFiltersApplied: false, // Track if auto-filters are applied
  
  // Filter options
  filterOptions: {
    states: [],
    types: [],
    cities: []
  },
  
  // Statistics
  stats: {
    totalCount: 0,
    typeDistribution: [],
    topStates: []
  },

  // Actions
  
  // Fetch all colleges
  fetchAllColleges: async () => {
    set({ loading: true, error: null });
    try {
      // For client-side filtering, we need to fetch ALL colleges without limit
      const params = {
        limit: 10000, // Large number to get all colleges
        sortBy: 'name',
        sortOrder: 'asc'
      };
      
      const response = await collegesAPI.getAllColleges(params);
      
      if (response.success) {
        set({
          colleges: response.data.colleges,
          pagination: response.data.pagination,
          loading: false
        });
      } else {
        throw new Error(response.message || 'Failed to fetch colleges');
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        colleges: []
      });
    }
  },

  // Fetch college by ID
  fetchCollegeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await collegesAPI.getCollegeById(id);
      
      if (response.success) {
        set({
          selectedCollege: response.data,
          loading: false
        });
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch college');
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        selectedCollege: null
      });
      return null;
    }
  },

  // Fetch filter options
  fetchFilterOptions: async () => {
    try {
      const response = await collegesAPI.getCollegeFilters();
      
      if (response.success) {
        set({
          filterOptions: response.data
        });
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  },

  // Fetch statistics
  fetchStats: async () => {
    try {
      const response = await collegesAPI.getCollegeStats();
      
      if (response.success) {
        set({
          stats: response.data
        });
      }
    } catch (error) {
      console.error('Failed to fetch college stats:', error);
    }
  },

  // Search colleges
  searchColleges: async (query) => {
    // For client-side filtering, we just update the search query
    // The actual filtering happens in getFilteredColleges()
    set({ searchQuery: query });
  },

  // Get filtered colleges based on search and filters (client-side filtering)
  getFilteredColleges: () => {
    const { colleges, searchQuery, filters } = get();
    
    return colleges.filter(college => {
      // Type filter
      const matchesType = filters.type === 'all' || college.type === filters.type;
      
      // State filter
      const matchesState = filters.state === 'all' || college.location?.state === filters.state;
      
      // City filter
      const matchesCity = filters.city === 'all' || college.location?.city === filters.city;
      
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

  // Update filters
  updateFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    
    set({ 
      filters: updatedFilters
    });
    // No need for API call - filtering happens client-side in getFilteredColleges()
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Clear filters
  clearFilters: () => {
    set({
      searchQuery: '',
      filters: {
        type: 'all',
        state: 'all',
        city: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
      },
      autoFiltersApplied: false
    });
    // No need for API call - filtering happens client-side in getFilteredColleges()
  },

  // Apply auto-filters based on user location
  applyAutoFilters: (user) => {
    if (!user || !user.state) return;
    
    // Check if colleges exist for user's state
    const { filterOptions } = get();
    const userState = user.state;
    
    // If user's state is available in filter options, apply the filter
    if (filterOptions.states?.includes(userState)) {
      const updatedFilters = { 
        ...get().filters, 
        state: userState 
      };
      
      set({ 
        filters: updatedFilters,
        autoFiltersApplied: true
      });
      // No need for API call - filtering happens client-side in getFilteredColleges()
    }
    // If no colleges in user's state, don't apply filter - keep it normal
  },

  // Clear all filters including auto-applied ones
  clearAllFilters: () => {
    set({
      searchQuery: '',
      filters: {
        type: 'all',
        state: 'all',
        city: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
      },
      autoFiltersApplied: false
    });
    // No need for API call - filtering happens client-side in getFilteredColleges()
  },

  // Change page - For client-side filtering, we'll implement pagination differently
  changePage: (page) => {
    set({ 
      pagination: { 
        ...get().pagination, 
        currentPage: page 
      } 
    });
    // Client-side pagination will be handled in the component
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset selected college
  clearSelectedCollege: () => set({ selectedCollege: null }),
}), {
  name: 'colleges-store'
}));

export { useCollegesStore };