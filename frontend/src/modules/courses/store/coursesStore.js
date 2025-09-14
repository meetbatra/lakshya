import { create } from 'zustand';
import { coursesAPI } from '../api/coursesAPI';

export const useCoursesStore = create((set, get) => ({
  // State
  courses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  selectedStream: 'all',
  selectedField: 'all',
  searchQuery: '',

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedStream: (stream) => set({ selectedStream: stream }),
  setSelectedField: (field) => set({ selectedField: field }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),

  // Fetch all courses
  fetchAllCourses: async () => {
    set({ loading: true, error: null });
    try {
      const result = await coursesAPI.getAllCourses();
      if (result.success) {
        set({ courses: result.data.courses || [], loading: false });
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch courses', loading: false });
    }
  },

  // Fetch courses by stream
  fetchCoursesByStream: async (stream) => {
    set({ loading: true, error: null });
    try {
      const result = await coursesAPI.getCoursesByStream(stream);
      if (result.success) {
        set({ courses: result.data.courses || [], loading: false });
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch courses by stream', loading: false });
    }
  },

  // Fetch courses by field
  fetchCoursesByField: async (field) => {
    set({ loading: true, error: null });
    try {
      const result = await coursesAPI.getCoursesByField(field);
      if (result.success) {
        set({ courses: result.data.courses || [], loading: false });
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch courses by field', loading: false });
    }
  },

  // Fetch course by ID
  fetchCourseById: async (courseId) => {
    set({ loading: true, error: null, selectedCourse: null });
    try {
      const result = await coursesAPI.getCourseById(courseId);
      if (result.success) {
        set({ selectedCourse: result.data.course || null, loading: false });
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch course details', loading: false });
    }
  },

  // Get filtered courses based on search only
  getFilteredCourses: () => {
    const { courses, searchQuery } = get();
    
    return courses.filter(course => {
      // Search filter - search across multiple fields
      const matchesSearch = !searchQuery || (() => {
        const query = searchQuery.toLowerCase();
        
        // Basic course info
        const basicMatch = course.name?.toLowerCase().includes(query) ||
                          course.shortName?.toLowerCase().includes(query) ||
                          course.description?.toLowerCase().includes(query) ||
                          course.field?.toLowerCase().includes(query);
        
        // Career options search
        const careerMatch = course.careerOptions?.some(career => 
          career.jobTitle?.toLowerCase().includes(query) ||
          career.description?.toLowerCase().includes(query)
        );
        
        // Skills search (both technical and soft skills)
        const skillsMatch = course.skills?.technical?.some(skill => 
          skill?.toLowerCase().includes(query)
        ) || course.skills?.soft?.some(skill => 
          skill?.toLowerCase().includes(query)
        );
        
        // College search
        const collegeMatch = course.topColleges?.some(college =>
          college.name?.toLowerCase().includes(query) ||
          college.location?.toLowerCase().includes(query)
        );
        
        return basicMatch || careerMatch || skillsMatch || collegeMatch;
      })();

      return matchesSearch;
    });
  },  // Get unique streams from courses
  getAvailableStreams: () => {
    const { courses } = get();
    const streams = [...new Set(courses.map(course => course.stream))].filter(Boolean);
    return streams;
  },

  // Get unique fields from courses
  getAvailableFields: () => {
    const { courses } = get();
    const fields = [...new Set(courses.map(course => course.field))].filter(Boolean);
    return fields;
  },

  // Reset filters
  resetFilters: () => set({
    selectedStream: 'all',
    selectedField: 'all',
    searchQuery: ''
  })
}));