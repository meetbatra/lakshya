const Course = require('../models/Course');
const { getAIRecommendedCourses } = require('./aiCourseService');

/**
 * Course Service - Handles all course-related business logic
 */

/**
 * Get courses by stream (for Class 10 quiz results)
 * @param {string} stream - The stream to filter by (science_pcm, science_pcb, commerce, arts)
 * @returns {Promise<Object>} Service response with courses
 */
const getCoursesByStream = async (stream) => {
  try {
    if (!stream) {
      return {
        success: false,
        message: 'Stream parameter is required'
      };
    }

    const validStreams = ['science_pcm', 'science_pcb', 'commerce', 'arts'];
    if (!validStreams.includes(stream)) {
      return {
        success: false,
        message: 'Invalid stream. Must be one of: ' + validStreams.join(', ')
      };
    }

    const courses = await Course.find({ stream })
      .select('name shortName stream field level duration description eligibility careerOptions')
      .sort({ name: 1 });

    return {
      success: true,
      message: `Courses for ${stream} stream retrieved successfully`,
      data: {
        stream,
        totalCourses: courses.length,
        courses: courses.map(course => ({
          id: course._id,
          name: course.name,
          shortName: course.shortName,
          stream: course.stream,
          field: course.field,
          level: course.level,
          duration: {
            years: course.duration.years,
            months: course.duration.months
          },
          description: course.description,
          eligibility: course.eligibility,
          careerOptions: course.careerOptions
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching courses by stream:', error);
    return {
      success: false,
      message: 'Failed to retrieve courses'
    };
  }
};

/**
 * Get courses by field (for Class 12 quiz results)
 * @param {string} field - The field to filter by
 * @returns {Promise<Object>} Service response with courses
 */
const getCoursesByField = async (field) => {
  try {
    if (!field) {
      return {
        success: false,
        message: 'Field parameter is required'
      };
    }

    const validFields = [
      // Science PCM fields
      'engineering_technology', 'architecture_design', 'defence_military', 'computer_it', 'pure_sciences_research',
      // Science PCB fields  
      'medicine', 'allied_health', 'biotechnology', 'veterinary_science', 'agriculture_environment',
      // Commerce fields
      'business_management', 'finance_accounting', 'economics_analytics', 'law_commerce', 'entrepreneurship',
      // Arts fields
      'social_sciences', 'psychology', 'journalism_media', 'fine_arts_design', 'law_arts', 'civil_services'
    ];

    if (!validFields.includes(field)) {
      return {
        success: false,
        message: 'Invalid field. Must be one of the predefined fields.'
      };
    }

    // Define related fields mapping - fields that overlap or are closely related
    const relatedFieldsMapping = {
      // Computer Science & IT related fields
      'computer_it': ['computer_it', 'engineering_technology'], // Include both CS and Engineering
      'engineering_technology': ['engineering_technology', 'computer_it'], // Include both Engineering and CS
      
      // Medical and Health related fields
      'medicine': ['medicine', 'allied_health', 'biotechnology'],
      'allied_health': ['allied_health', 'medicine', 'biotechnology'],
      'biotechnology': ['biotechnology', 'medicine', 'allied_health'],
      
      // Business and Management related fields
      'business_management': ['business_management', 'entrepreneurship', 'economics_analytics'],
      'entrepreneurship': ['entrepreneurship', 'business_management', 'economics_analytics'],
      'economics_analytics': ['economics_analytics', 'business_management', 'finance_accounting'],
      'finance_accounting': ['finance_accounting', 'economics_analytics', 'business_management'],
      
      // Law related fields
      'law_commerce': ['law_commerce', 'law_arts'],
      'law_arts': ['law_arts', 'law_commerce'],
      
      // Science and Research related fields
      'pure_sciences_research': ['pure_sciences_research', 'biotechnology'],
      
      // Single field mappings (no close overlaps)
      'architecture_design': ['architecture_design'],
      'defence_military': ['defence_military'],
      'veterinary_science': ['veterinary_science'],
      'agriculture_environment': ['agriculture_environment'],
      'social_sciences': ['social_sciences'],
      'psychology': ['psychology'],
      'journalism_media': ['journalism_media'],
      'fine_arts_design': ['fine_arts_design'],
      'civil_services': ['civil_services']
    };

    // Get related fields for the requested field
    const fieldsToQuery = relatedFieldsMapping[field] || [field];

    // Find courses in the primary field and related fields
    const courses = await Course.find({ field: { $in: fieldsToQuery } })
      .select('name shortName stream field level duration description eligibility careerOptions')
      .sort({ field: 1, name: 1 }); // Sort by field first (primary field courses first), then by name

    // Separate primary and related courses for better organization
    const primaryCourses = courses.filter(course => course.field === field);
    const relatedCourses = courses.filter(course => course.field !== field);

    // Combine courses with primary courses first
    const orderedCourses = [...primaryCourses, ...relatedCourses];

    return {
      success: true,
      message: `Courses for ${field} field retrieved successfully`,
      data: {
        field,
        totalCourses: orderedCourses.length,
        primaryCourses: primaryCourses.length,
        relatedCourses: relatedCourses.length,
        courses: orderedCourses.map(course => ({
          id: course._id,
          name: course.name,
          shortName: course.shortName,
          stream: course.stream,
          field: course.field,
          level: course.level,
          duration: {
            years: course.duration.years,
            months: course.duration.months
          },
          description: course.description,
          eligibility: course.eligibility,
          careerOptions: course.careerOptions,
          isPrimary: course.field === field // Flag to identify primary vs related courses
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching courses by field:', error);
    return {
      success: false,
      message: 'Failed to retrieve courses'
    };
  }
};

/**
 * Get all courses with optional filtering
 * @param {Object} filters - Optional filters (stream, field, level)
 * @returns {Promise<Object>} Service response with courses
 */
const getAllCourses = async (filters = {}) => {
  try {
    const { stream, field, level } = filters;
    const query = {};

    if (stream) query.stream = stream;
    if (field) query.field = field;
    if (level) query.level = level;

    const courses = await Course.find(query)
      .select('name shortName stream field level duration description eligibility')
      .sort({ name: 1 });

    return {
      success: true,
      message: 'Courses retrieved successfully',
      data: {
        filters: query,
        totalCourses: courses.length,
        courses: courses.map(course => ({
          id: course._id,
          name: course.name,
          shortName: course.shortName,
          stream: course.stream,
          field: course.field,
          level: course.level,
          duration: {
            years: course.duration.years,
            months: course.duration.months
          },
          description: course.description,
          eligibility: course.eligibility
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching all courses:', error);
    return {
      success: false,
      message: 'Failed to retrieve courses'
    };
  }
};

/**
 * Get course by ID
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Service response with course details
 */
const getCourseById = async (courseId) => {
  try {
    if (!courseId) {
      return {
        success: false,
        message: 'Course ID is required'
      };
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return {
        success: false,
        message: 'Course not found'
      };
    }

    return {
      success: true,
      message: 'Course retrieved successfully',
      data: {
        id: course._id,
        name: course.name,
        shortName: course.shortName,
        stream: course.stream,
        field: course.field,
        level: course.level,
        duration: {
          years: course.duration.years,
          months: course.duration.months
        },
        description: course.description,
        eligibility: course.eligibility,
        careerOptions: course.careerOptions,
        colleges: course.colleges,
        fees: course.fees,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }
    };
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return {
      success: false,
      message: 'Failed to retrieve course'
    };
  }
};

/**
 * Get AI-recommended courses by field (enhanced version)
 * @param {string} field - The field to get recommendations for
 * @returns {Promise<Object>} Service response with AI-recommended courses
 */
const getAIRecommendedCoursesByField = async (field) => {
  try {
    if (!field) {
      return {
        success: false,
        message: 'Field parameter is required'
      };
    }

    // Get all courses from database
    const allCourses = await Course.find({})
      .select('name shortName stream field level duration description eligibility careerOptions')
      .lean();

    if (allCourses.length === 0) {
      return {
        success: false,
        message: 'No courses found in database'
      };
    }

    // Use AI to analyze and recommend courses
    const aiResult = await getAIRecommendedCourses(field, allCourses);
    
    return aiResult;

  } catch (error) {
    console.error('Error getting AI-recommended courses by field:', error);
    return {
      success: false,
      message: 'Failed to retrieve AI-recommended courses'
    };
  }
};

module.exports = {
  getCoursesByStream,
  getCoursesByField,
  getAIRecommendedCoursesByField,
  getAllCourses,
  getCourseById
};