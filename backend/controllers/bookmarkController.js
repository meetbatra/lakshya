const { 
  addBookmark: addBookmarkService, 
  removeBookmark: removeBookmarkService, 
  getBookmarks: getBookmarksService, 
  isBookmarked: isBookmarkedService, 
  getBookmarkCounts: getBookmarkCountsService 
} = require('../services/bookmarkService');

/**
 * Bookmark Controller
 * Handles HTTP requests and responses for bookmark operations
 */

// Add bookmark
const addBookmark = async (req, res) => {
  const { type, itemId } = req.body;
  const userId = req.user.id;

  const result = await addBookmarkService(userId, type, itemId);

  if (!result.success) {
    return res.status(result.status).json({
      success: false,
      message: result.message,
      error: result.error
    });
  }

  res.status(result.status).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

// Remove bookmark
const removeBookmark = async (req, res) => {
  const { type, itemId } = req.body;
  const userId = req.user.id;

  const result = await removeBookmarkService(userId, type, itemId);

  if (!result.success) {
    return res.status(result.status).json({
      success: false,
      message: result.message,
      error: result.error
    });
  }

  res.status(result.status).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

// Get user bookmarks with optional type filtering
const getBookmarks = async (req, res) => {
  const userId = req.user.id;
  const { type } = req.query;

  const result = await getBookmarksService(userId, type);

  if (!result.success) {
    return res.status(result.status).json({
      success: false,
      message: result.message,
      error: result.error
    });
  }

  res.status(result.status).json({
    success: true,
    data: result.data
  });
};

// Check if item is bookmarked
const isBookmarked = async (req, res) => {
  const { type, itemId } = req.params;
  const userId = req.user.id;

  const result = await isBookmarkedService(userId, type, itemId);

  if (!result.success) {
    return res.status(result.status).json({
      success: false,
      message: result.message,
      error: result.error
    });
  }

  res.status(result.status).json({
    success: true,
    isBookmarked: result.data.isBookmarked
  });
};

// Get bookmark counts
const getBookmarkCounts = async (req, res) => {
  const userId = req.user.id;

  const result = await getBookmarkCountsService(userId);

  if (!result.success) {
    return res.status(result.status).json({
      success: false,
      message: result.message,
      error: result.error
    });
  }

  res.status(result.status).json({
    success: true,
    data: result.data
  });
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
  getBookmarkCounts
};