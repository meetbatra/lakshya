const College = require('../models/College');

// Get all colleges with optional filtering and search
const getAllColleges = async (req, res) => {
  try {
    const {
      search,
      type,
      state,
      city,
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

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

    res.json({
      success: true,
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
    });

  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges',
      error: error.message
    });
  }
};

// Get college by ID
const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id)
      .populate('courses.courseId', 'name shortName description')
      .lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      data: college
    });

  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college',
      error: error.message
    });
  }
};

// Get filter options (states, cities, types)
const getFilterOptions = async (req, res) => {
  try {
    const [states, types, cities] = await Promise.all([
      College.distinct('location.state', { isActive: true }),
      College.distinct('type', { isActive: true }),
      College.distinct('location.city', { isActive: true })
    ]);

    res.json({
      success: true,
      data: {
        states: states.sort(),
        types: types.sort(),
        cities: cities.sort()
      }
    });

  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

// Get colleges statistics
const getCollegeStats = async (req, res) => {
  try {
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

    res.json({
      success: true,
      data: {
        totalCount,
        typeDistribution: typeStats,
        topStates: stateStats
      }
    });

  } catch (error) {
    console.error('Error fetching college stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching college statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllColleges,
  getCollegeById,
  getFilterOptions,
  getCollegeStats
};
