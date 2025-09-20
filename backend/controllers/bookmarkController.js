const User = require('../models/User');
const Course = require('../models/Course');
const College = require('../models/College');
const Exam = require('../models/Exam');

// Add bookmark
const addBookmark = async (req, res) => {
  try {
    const { type, itemId } = req.body;
    const userId = req.user.id;

    // Validate type
    if (!['courses', 'colleges', 'exams'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookmark type. Must be courses, colleges, or exams.'
      });
    }

    // Validate itemId
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    // Verify item exists
    let Model;
    switch (type) {
      case 'courses':
        Model = Course;
        break;
      case 'colleges':
        Model = College;
        break;
      case 'exams':
        Model = Exam;
        break;
    }

    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${type.slice(0, -1)} not found`
      });
    }

    // Find user and add bookmark
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize bookmarks if not exist
    if (!user.bookmarks) {
      user.bookmarks = { courses: [], colleges: [], exams: [] };
    }

    // Check if already bookmarked
    if (user.bookmarks[type].includes(itemId)) {
      return res.status(400).json({
        success: false,
        message: `${type.slice(0, -1)} already bookmarked`
      });
    }

    // Add bookmark
    user.bookmarks[type].push(itemId);
    await user.save();

    res.status(200).json({
      success: true,
      message: `${type.slice(0, -1)} bookmarked successfully`,
      bookmarks: user.bookmarks
    });

  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove bookmark
const removeBookmark = async (req, res) => {
  try {
    const { type, itemId } = req.body;
    const userId = req.user.id;

    // Validate type
    if (!['courses', 'colleges', 'exams'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookmark type. Must be courses, colleges, or exams.'
      });
    }

    // Find user and remove bookmark
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize bookmarks if not exist
    if (!user.bookmarks) {
      user.bookmarks = { courses: [], colleges: [], exams: [] };
    }

    // Remove bookmark
    user.bookmarks[type] = user.bookmarks[type].filter(
      id => id.toString() !== itemId.toString()
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: `${type.slice(0, -1)} removed from bookmarks`,
      bookmarks: user.bookmarks
    });

  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user bookmarks
const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('bookmarks.courses', 'name shortName description level duration stream')
      .populate('bookmarks.colleges', 'name shortName location type courses')
      .populate('bookmarks.exams', 'name shortName description examMonth streams eligibility');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize bookmarks if not exist
    if (!user.bookmarks) {
      user.bookmarks = { courses: [], colleges: [], exams: [] };
    }

    console.log(user.bookmarks);

    res.status(200).json({
      success: true,
      bookmarks: user.bookmarks
    });

  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Check if item is bookmarked
const isBookmarked = async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const userId = req.user.id;

    // Validate type
    if (!['courses', 'colleges', 'exams'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookmark type. Must be courses, colleges, or exams.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize bookmarks if not exist
    if (!user.bookmarks) {
      user.bookmarks = { courses: [], colleges: [], exams: [] };
    }

    const isBookmarked = user.bookmarks[type].includes(itemId);

    res.status(200).json({
      success: true,
      isBookmarked
    });

  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked
};