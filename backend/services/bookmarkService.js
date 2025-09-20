const User = require('../models/User');
const Course = require('../models/Course');
const College = require('../models/College');
const Exam = require('../models/Exam');

/**
 * Bookmark Service
 * Handles bookmark-related business logic and database operations
 */

/**
 * Get the appropriate model based on bookmark type
 * @param {string} type - Bookmark type (courses, colleges, exams)
 * @returns {Object} Mongoose model
 */
const getModelByType = (type) => {
  const models = {
    courses: Course,
    colleges: College,
    exams: Exam
  };
  return models[type];
};

/**
 * Validate bookmark type
 * @param {string} type - Bookmark type to validate
 * @returns {boolean} True if valid
 */
const isValidType = (type) => {
  return ['courses', 'colleges', 'exams'].includes(type);
};

/**
 * Initialize user bookmarks if they don't exist
 * @param {Object} user - User document
 * @returns {Object} User with initialized bookmarks
 */
const initializeBookmarks = (user) => {
  if (!user.bookmarks) {
    user.bookmarks = { courses: [], colleges: [], exams: [] };
  }
  return user;
};

/**
 * Add a bookmark for a user
 * @param {string} userId - User ID
 * @param {string} type - Bookmark type
 * @param {string} itemId - Item ID to bookmark
 * @returns {Object} Result object
 */
const addBookmark = async (userId, type, itemId) => {
  try {
    // Validate inputs
    if (!userId || !type || !itemId) {
      return {
        success: false,
        status: 400,
        message: 'User ID, type, and item ID are required'
      };
    }

    if (!isValidType(type)) {
      return {
        success: false,
        status: 400,
        message: 'Invalid bookmark type. Must be courses, colleges, or exams.'
      };
    }

    // Verify item exists
    const Model = getModelByType(type);
    const item = await Model.findById(itemId);
    if (!item) {
      return {
        success: false,
        status: 404,
        message: `${type.slice(0, -1)} not found`
      };
    }

    // Find user and add bookmark
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: 'User not found'
      };
    }

    // Initialize bookmarks if not exist
    initializeBookmarks(user);

    // Check if already bookmarked
    if (user.bookmarks[type].includes(itemId)) {
      return {
        success: false,
        status: 400,
        message: `${type.slice(0, -1)} already bookmarked`
      };
    }

    // Add bookmark
    user.bookmarks[type].push(itemId);
    await user.save();

    // Get updated bookmarks with populated data
    const updatedUser = await User.findById(userId)
      .populate('bookmarks.courses')
      .populate('bookmarks.colleges') 
      .populate('bookmarks.exams');

    return {
      success: true,
      status: 200,
      message: `${type.slice(0, -1)} bookmarked successfully`,
      data: {
        bookmarks: updatedUser.bookmarks
      }
    };

  } catch (error) {
    console.error('Add bookmark service error:', error);
    return {
      success: false,
      status: 500,
      message: 'Internal server error while adding bookmark',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

/**
 * Remove a bookmark for a user
 * @param {string} userId - User ID
 * @param {string} type - Bookmark type
 * @param {string} itemId - Item ID to remove from bookmarks
 * @returns {Object} Result object
 */
const removeBookmark = async (userId, type, itemId) => {
  try {
    // Validate inputs
    if (!userId || !type || !itemId) {
      return {
        success: false,
        status: 400,
        message: 'User ID, type, and item ID are required'
      };
    }

    if (!isValidType(type)) {
      return {
        success: false,
        status: 400,
        message: 'Invalid bookmark type. Must be courses, colleges, or exams.'
      };
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: 'User not found'
      };
    }

    // Initialize bookmarks if not exist
    initializeBookmarks(user);

    // Check if bookmark exists
    if (!user.bookmarks[type].includes(itemId)) {
      return {
        success: false,
        status: 400,
        message: `${type.slice(0, -1)} not bookmarked`
      };
    }

    // Remove bookmark
    user.bookmarks[type] = user.bookmarks[type].filter(id => id.toString() !== itemId);
    await user.save();

    // Get updated bookmarks with populated data
    const updatedUser = await User.findById(userId)
      .populate('bookmarks.courses')
      .populate('bookmarks.colleges') 
      .populate('bookmarks.exams');

    return {
      success: true,
      status: 200,
      message: `${type.slice(0, -1)} removed from bookmarks`,
      data: {
        bookmarks: updatedUser.bookmarks
      }
    };

  } catch (error) {
    console.error('Remove bookmark service error:', error);
    return {
      success: false,
      status: 500,
      message: 'Internal server error while removing bookmark',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

/**
 * Get all bookmarks for a user
 * @param {string} userId - User ID
 * @returns {Object} Result object
 */
const getBookmarks = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        status: 400,
        message: 'User ID is required'
      };
    }

    const user = await User.findById(userId)
      .populate('bookmarks.courses')
      .populate('bookmarks.colleges') 
      .populate('bookmarks.exams');

    if (!user) {
      return {
        success: false,
        status: 404,
        message: 'User not found'
      };
    }

    // Initialize bookmarks if not exist
    initializeBookmarks(user);

    return {
      success: true,
      status: 200,
      data: {
        bookmarks: user.bookmarks
      }
    };

  } catch (error) {
    console.error('Get bookmarks service error:', error);
    return {
      success: false,
      status: 500,
      message: 'Internal server error while fetching bookmarks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

/**
 * Check if an item is bookmarked by a user
 * @param {string} userId - User ID
 * @param {string} type - Bookmark type
 * @param {string} itemId - Item ID to check
 * @returns {Object} Result object
 */
const isBookmarked = async (userId, type, itemId) => {
  try {
    if (!userId || !type || !itemId) {
      return {
        success: false,
        status: 400,
        message: 'User ID, type, and item ID are required'
      };
    }

    if (!isValidType(type)) {
      return {
        success: false,
        status: 400,
        message: 'Invalid bookmark type. Must be courses, colleges, or exams.'
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: 'User not found'
      };
    }

    // Initialize bookmarks if not exist
    initializeBookmarks(user);

    const isBookmarked = user.bookmarks[type].includes(itemId);

    return {
      success: true,
      status: 200,
      data: {
        isBookmarked
      }
    };

  } catch (error) {
    console.error('Check bookmark service error:', error);
    return {
      success: false,
      status: 500,
      message: 'Internal server error while checking bookmark',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

/**
 * Get bookmark counts for a user
 * @param {string} userId - User ID
 * @returns {Object} Result object with bookmark counts
 */
const getBookmarkCounts = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        status: 400,
        message: 'User ID is required'
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: 'User not found'
      };
    }

    // Initialize bookmarks if not exist
    initializeBookmarks(user);

    const counts = {
      courses: user.bookmarks.courses.length,
      colleges: user.bookmarks.colleges.length,
      exams: user.bookmarks.exams.length,
      total: user.bookmarks.courses.length + user.bookmarks.colleges.length + user.bookmarks.exams.length
    };

    return {
      success: true,
      status: 200,
      data: counts
    };

  } catch (error) {
    console.error('Get bookmark counts service error:', error);
    return {
      success: false,
      status: 500,
      message: 'Internal server error while getting bookmark counts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
  getBookmarkCounts
};