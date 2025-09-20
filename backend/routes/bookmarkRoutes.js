const express = require('express');
const router = express.Router();
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
  getBookmarkCounts
} = require('../controllers/bookmarkController');
const { authenticateToken, wrapAsync } = require('../utils/middleware');

// Apply authentication middleware to all bookmark routes
router.use(authenticateToken);

// Add bookmark
router.post('/add', wrapAsync(addBookmark));

// Remove bookmark
router.post('/remove', wrapAsync(removeBookmark));

// Get all bookmarks for user
router.get('/', wrapAsync(getBookmarks));

// Check if specific item is bookmarked
router.get('/check/:type/:itemId', wrapAsync(isBookmarked));

// Get bookmark counts
router.get('/counts', wrapAsync(getBookmarkCounts));

module.exports = router;