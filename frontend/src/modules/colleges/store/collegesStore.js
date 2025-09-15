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
  fetchAllColleges: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { searchQuery, filters } = get();
      const params = {
        page,
        limit: 20,
        search: searchQuery || undefined,
        ...filters
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
    set({ searchQuery: query, loading: true, error: null });
    try {
      const { filters } = get();
      const params = {
        page: 1,
        limit: 20,
        search: query || undefined,
        ...filters
      };
      
      const response = await collegesAPI.getAllColleges(params);
      
      if (response.success) {
        set({
          colleges: response.data.colleges,
          pagination: response.data.pagination,
          loading: false
        });
      } else {
        throw new Error(response.message || 'Failed to search colleges');
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        colleges: []
      });
    }
  },

  // Update filters
  updateFilters: async (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    
    set({ 
      filters: updatedFilters,
      loading: true,
      error: null 
    });
    
    try {
      const { searchQuery } = get();
      const params = {
        page: 1,
        limit: 20,
        search: searchQuery || undefined,
        ...updatedFilters
      };
      
      const response = await collegesAPI.getAllColleges(params);
      
      if (response.success) {
        set({
          colleges: response.data.colleges,
          pagination: response.data.pagination,
          loading: false
        });
      } else {
        throw new Error(response.message || 'Failed to filter colleges');
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        colleges: []
      });
    }
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Clear filters
  clearFilters: async () => {
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
    
    // Fetch colleges with cleared filters
    get().fetchAllColleges(1);
  },

  // Apply auto-filters based on user location
  applyAutoFilters: async (user) => {
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
        autoFiltersApplied: true,
        loading: true,
        error: null 
      });
      
      try {
        const { searchQuery } = get();
        const params = {
          page: 1,
          limit: 20,
          search: searchQuery || undefined,
          ...updatedFilters
        };
        
        const response = await collegesAPI.getAllColleges(params);
        
        if (response.success) {
          set({
            colleges: response.data.colleges,
            pagination: response.data.pagination,
            loading: false
          });
        } else {
          throw new Error(response.message || 'Failed to filter colleges');
        }
      } catch (error) {
        set({
          error: error.message,
          loading: false,
          colleges: []
        });
      }
    }
    // If no colleges in user's state, don't apply filter - keep it normal
  },

  // Clear all filters including auto-applied ones
  clearAllFilters: async () => {
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
    
    // Fetch colleges with cleared filters
    get().fetchAllColleges(1);
  },

  // Change page
  changePage: async (page) => {
    get().fetchAllColleges(page);
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset selected college
  clearSelectedCollege: () => set({ selectedCollege: null }),

  // Get filtered colleges (client-side utility)
  getFilteredColleges: () => {
    const { colleges, searchQuery } = get();
    
    if (!searchQuery) return colleges;
    
    const query = searchQuery.toLowerCase();
    return colleges.filter(college =>
      college.name?.toLowerCase().includes(query) ||
      college.shortName?.toLowerCase().includes(query) ||
      college.location?.city?.toLowerCase().includes(query) ||
      college.location?.state?.toLowerCase().includes(query)
    );
  }
}), {
  name: 'colleges-store'
}));

export { useCollegesStore };