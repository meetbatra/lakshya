const express = require('express');
const router = express.Router();

// Import controllers and utilities
const collegeController = require('../controllers/collegeController');
const { wrapAsync } = require('../utils/middleware');

// GET /api/colleges - Get all colleges with filtering and search
router.get('/', wrapAsync(collegeController.getAllColleges));

// GET /api/colleges/stats - Get college statistics
router.get('/stats', wrapAsync(collegeController.getCollegeStats));

// GET /api/colleges/filters - Get filter options
router.get('/filters', wrapAsync(collegeController.getFilterOptions));

// GET /api/colleges/:id - Get college by ID
router.get('/:id', wrapAsync(collegeController.getCollegeById));

module.exports = router;
