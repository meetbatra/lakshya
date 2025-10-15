import { coursesAPI } from '../api/coursesAPI';

// Direct API functions without state management
export const useCoursesStore = {
  // Fetch all courses directly
  fetchAllCourses: async () => {
    try {
      const result = await coursesAPI.getAllCourses();
      if (result.success) {
        return { success: true, data: result.data.courses || [] };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to fetch courses' };
    }
  },

  // Fetch courses by stream directly
  fetchCoursesByStream: async (stream) => {
    try {
      const result = await coursesAPI.getCoursesByStream(stream);
      if (result.success) {
        return { success: true, data: result.data.courses || [] };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to fetch courses by stream' };
    }
  },

  // Fetch courses by field directly
  fetchCoursesByField: async (field) => {
    try {
      const result = await coursesAPI.getCoursesByField(field);
      if (result.success) {
        return { success: true, data: result.data.courses || [] };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to fetch courses by field' };
    }
  },

  // Fetch course by ID directly
  fetchCourseById: async (courseId) => {
    try {
      const result = await coursesAPI.getCourseById(courseId);
      if (result.success) {
        return { success: true, data: result.data.course };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to fetch course details' };
    }
  },

  // Client-side filtering utility functions
  filterCourses: (courses, filters) => {
    const { searchQuery, selectedStream, selectedField } = filters;
    
    return courses.filter(course => {
      // Stream filter
      const matchesStream = selectedStream === 'all' || course.stream === selectedStream;
      
      // Field filter
      const matchesField = selectedField === 'all' || course.field === selectedField;
      
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

      return matchesStream && matchesField && matchesSearch;
    });
  },

  // Get unique streams from courses
  getAvailableStreams: (courses) => {
    const streams = [...new Set(courses.map(course => course.stream))].filter(Boolean);
    return streams;
  },

  // Get unique fields from courses
  getAvailableFields: (courses) => {
    const fields = [...new Set(courses.map(course => course.field))].filter(Boolean);
    return fields;
  }
};