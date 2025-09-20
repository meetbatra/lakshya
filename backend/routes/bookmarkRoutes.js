const express = require('express');
const router = express.Router();
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked
} = require('../controllers/bookmarkController');
const { authenticateToken } = require('../utils/middleware');

// Apply authentication middleware to all bookmark routes
router.use(authenticateToken);

// Add bookmark
router.post('/add', addBookmark);

// Remove bookmark
router.post('/remove', removeBookmark);

// Get all bookmarks for user
router.get('/', getBookmarks);

// Check if specific item is bookmarked
router.get('/check/:type/:itemId', isBookmarked);

module.exports = router;