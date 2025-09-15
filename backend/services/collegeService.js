const College = require('../models/College');

/**
 * College Service - Handles all college-related business logic
 */

/**
 * Get all colleges with filtering, search, and pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Service response with colleges and pagination
 */
const getAllColleges = async (options = {}) => {
  const {
    search,
    type,
    state,
    city,
    page = 1,
    limit = 20,
    sortBy = 'name',
    sortOrder = 'asc'
  } = options;

  // Build query object
  let query = { isActive: true };

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { shortName: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
      { 'location.state': { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by type
  if (type && type !== 'all') {
    query.type = type;
  }

  // Filter by state
  if (state && state !== 'all') {
    query['location.state'] = state;
  }

  // Filter by city
  if (city && city !== 'all') {
    query['location.city'] = city;
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query with pagination
  const [colleges, totalCount] = await Promise.all([
    College.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('courses.courseId', 'name shortName')
      .lean(),
    College.countDocuments(query)
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / parseInt(limit));
  const currentPage = parseInt(page);

  return {
    success: true,
    message: 'Colleges retrieved successfully',
    data: {
      colleges,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        limit: parseInt(limit)
      }
    }
  };
};

/**
 * Get college by ID
 * @param {string} collegeId - The college ID
 * @returns {Promise<Object>} Service response with college data
 */
const getCollegeById = async (collegeId) => {
  if (!collegeId) {
    return {
      success: false,
      message: 'College ID is required'
    };
  }

  const college = await College.findById(collegeId)
    .populate('courses.courseId', 'name shortName description')
    .lean();

  if (!college) {
    return {
      success: false,
      message: 'College not found'
    };
  }

  return {
    success: true,
    message: 'College retrieved successfully',
    data: college
  };
};

/**
 * Get colleges by state
 * @param {string} state - The state to filter by
 * @param {Object} options - Additional query options
 * @returns {Promise<Object>} Service response with colleges
 */
const getCollegesByState = async (state, options = {}) => {
  if (!state) {
    return {
      success: false,
      message: 'State parameter is required'
    };
  }

  const queryOptions = {
    ...options,
    state
  };

  return await getAllColleges(queryOptions);
};

/**
 * Get colleges by type
 * @param {string} type - The college type to filter by
 * @param {Object} options - Additional query options
 * @returns {Promise<Object>} Service response with colleges
 */
const getCollegesByType = async (type, options = {}) => {
  if (!type) {
    return {
      success: false,
      message: 'Type parameter is required'
    };
  }

  const validTypes = ['government', 'private', 'deemed', 'autonomous'];
  if (!validTypes.includes(type)) {
    return {
      success: false,
      message: 'Invalid college type. Must be one of: ' + validTypes.join(', ')
    };
  }

  const queryOptions = {
    ...options,
    type
  };

  return await getAllColleges(queryOptions);
};

/**
 * Search colleges by text query
 * @param {string} searchQuery - The search query
 * @param {Object} options - Additional query options
 * @returns {Promise<Object>} Service response with colleges
 */
const searchColleges = async (searchQuery, options = {}) => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return {
      success: false,
      message: 'Search query is required'
    };
  }

  const queryOptions = {
    ...options,
    search: searchQuery.trim()
  };

  return await getAllColleges(queryOptions);
};

/**
 * Get filter options (states, cities, types)
 * @returns {Promise<Object>} Service response with filter options
 */
const getFilterOptions = async () => {
  const [states, types, cities] = await Promise.all([
    College.distinct('location.state', { isActive: true }),
    College.distinct('type', { isActive: true }),
    College.distinct('location.city', { isActive: true })
  ]);

  return {
    success: true,
    message: 'Filter options retrieved successfully',
    data: {
      states: states.sort(),
      types: types.sort(),
      cities: cities.sort()
    }
  };
};

/**
 * Get college statistics
 * @returns {Promise<Object>} Service response with statistics
 */
const getCollegeStats = async () => {
  const [totalCount, typeStats, stateStats] = await Promise.all([
    College.countDocuments({ isActive: true }),
    College.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    College.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    success: true,
    message: 'College statistics retrieved successfully',
    data: {
      totalCount,
      typeDistribution: typeStats,
      topStates: stateStats
    }
  };
};

/**
 * Get colleges with courses in a specific field
 * @param {string} field - The field to filter by
 * @param {Object} options - Additional query options
 * @returns {Promise<Object>} Service response with colleges
 */
const getCollegesWithField = async (field, options = {}) => {
  if (!field) {
    return {
      success: false,
      message: 'Field parameter is required'
    };
  }

  // Find colleges that have courses in the specified field
  const colleges = await College.find({
    isActive: true,
    'courses.field': field
  })
    .populate('courses.courseId', 'name shortName field')
    .sort({ name: 1 })
    .lean();

  // Filter courses to only include those in the specified field
  const filteredColleges = colleges.map(college => ({
    ...college,
    courses: college.courses.filter(course => 
      course.courseId && course.courseId.field === field
    )
  }));

  return {
    success: true,
    message: `Colleges with ${field} field retrieved successfully`,
    data: {
      field,
      totalColleges: filteredColleges.length,
      colleges: filteredColleges
    }
  };
};

/**
 * Get recommended colleges for a user based on their preferences
 * @param {Object} user - User object with preferences
 * @param {Object} options - Additional query options
 * @returns {Promise<Object>} Service response with recommended colleges
 */
const getRecommendedColleges = async (user, options = {}) => {
  if (!user) {
    return {
      success: false,
      message: 'User data is required'
    };
  }

  let query = { isActive: true };
  
  // Filter by user's state if available
  if (user.state) {
    query['location.state'] = user.state;
  }

  // Filter by field if user has one (Class 12 students)
  if (user.field) {
    query['courses.field'] = user.field;
  }

  const colleges = await College.find(query)
    .populate('courses.courseId', 'name shortName field stream')
    .sort({ name: 1 })
    .limit(options.limit || 10)
    .lean();

  return {
    success: true,
    message: 'Recommended colleges retrieved successfully',
    data: {
      user: {
        class: user.class,
        state: user.state,
        stream: user.stream,
        field: user.field
      },
      totalColleges: colleges.length,
      colleges
    }
  };
};

module.exports = {
  getAllColleges,
  getCollegeById,
  getCollegesByState,
  getCollegesByType,
  searchColleges,
  getFilterOptions,
  getCollegeStats,
  getCollegesWithField,
  getRecommendedColleges
};