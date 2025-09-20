const Exam = require('../models/Exam');

/**
 * Exam Service - Handles all exam-related business logic
 */

/**
 * Get all exams with filtering, search, and pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Service response with exams and pagination
 */
const getAllExams = async (options = {}) => {
  const {
    search,
    streams,
    examMonth,
    page = 1,
    limit = 10000, // Large limit for client-side filtering like colleges
    sortBy = 'name',
    sortOrder = 'asc'
  } = options;

  try {
    // Build query object
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { syllabus: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    // Filter by streams
    if (streams && streams !== 'all') {
      query.streams = { $in: Array.isArray(streams) ? streams : [streams] };
    }

    // Filter by exam month
    if (examMonth && examMonth !== 'all') {
      query.examMonth = { $regex: examMonth, $options: 'i' };
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [exams, totalCount] = await Promise.all([
      Exam.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Exam.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      success: true,
      data: {
        exams,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    };

  } catch (error) {
    console.error('Error in getAllExams:', error);
    return {
      success: false,
      message: 'Failed to fetch exams',
      error: error.message
    };
  }
};

/**
 * Get exam by ID
 * @param {string} id - Exam ID
 * @returns {Promise<Object>} Service response with exam data
 */
const getExamById = async (id) => {
  try {
    const exam = await Exam.findById(id).lean();

    if (!exam) {
      return {
        success: false,
        message: 'Exam not found'
      };
    }

    return {
      success: true,
      data: { exam }
    };

  } catch (error) {
    console.error('Error in getExamById:', error);
    return {
      success: false,
      message: 'Failed to fetch exam',
      error: error.message
    };
  }
};

/**
 * Get filter options for exams
 * @returns {Promise<Object>} Service response with filter options
 */
const getFilterOptions = async () => {
  try {
    const [streams, examMonths] = await Promise.all([
      Exam.distinct('streams', { isActive: true }),
      Exam.distinct('examMonth', { isActive: true, examMonth: { $ne: null } })
    ]);

    return {
      success: true,
      data: {
        streams: streams.filter(stream => stream), // Remove null/empty values
        examMonths: examMonths.filter(month => month) // Remove null/empty values
      }
    };

  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    return {
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    };
  }
};

/**
 * Get exam statistics
 * @returns {Promise<Object>} Service response with statistics
 */
const getExamStats = async () => {
  try {
    const [
      totalExams,
      examsByStream,
      examsByMonth
    ] = await Promise.all([
      Exam.countDocuments({ isActive: true }),
      Exam.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$streams' },
        { $group: { _id: '$streams', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Exam.aggregate([
        { $match: { isActive: true, examMonth: { $ne: null } } },
        { $group: { _id: '$examMonth', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return {
      success: true,
      data: {
        totalExams,
        examsByStream,
        examsByMonth
      }
    };

  } catch (error) {
    console.error('Error in getExamStats:', error);
    return {
      success: false,
      message: 'Failed to fetch exam statistics',
      error: error.message
    };
  }
};

/**
 * Create a new exam
 * @param {Object} examData - Exam data
 * @returns {Promise<Object>} Service response with created exam
 */
const createExam = async (examData) => {
  try {
    const exam = new Exam(examData);
    await exam.save();

    return {
      success: true,
      data: { exam },
      message: 'Exam created successfully'
    };

  } catch (error) {
    console.error('Error in createExam:', error);
    return {
      success: false,
      message: 'Failed to create exam',
      error: error.message
    };
  }
};

/**
 * Update exam by ID
 * @param {string} id - Exam ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Service response with updated exam
 */
const updateExam = async (id, updateData) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return {
        success: false,
        message: 'Exam not found'
      };
    }

    return {
      success: true,
      data: { exam },
      message: 'Exam updated successfully'
    };

  } catch (error) {
    console.error('Error in updateExam:', error);
    return {
      success: false,
      message: 'Failed to update exam',
      error: error.message
    };
  }
};

/**
 * Delete exam by ID (soft delete)
 * @param {string} id - Exam ID
 * @returns {Promise<Object>} Service response
 */
const deleteExam = async (id) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!exam) {
      return {
        success: false,
        message: 'Exam not found'
      };
    }

    return {
      success: true,
      message: 'Exam deleted successfully'
    };

  } catch (error) {
    console.error('Error in deleteExam:', error);
    return {
      success: false,
      message: 'Failed to delete exam',
      error: error.message
    };
  }
};

module.exports = {
  getAllExams,
  getExamById,
  getFilterOptions,
  getExamStats,
  createExam,
  updateExam,
  deleteExam
};