const express = require('express');
const router = express.Router();
const {
  getAllColleges,
  getCollegeById,
  getFilterOptions,
  getCollegeStats
} = require('../controllers/collegeController');

// GET /api/colleges - Get all colleges with filtering and search
router.get('/', getAllColleges);

// GET /api/colleges/stats - Get college statistics
router.get('/stats', getCollegeStats);

// GET /api/colleges/filters - Get filter options
router.get('/filters', getFilterOptions);

// GET /api/colleges/:id - Get college by ID
router.get('/:id', getCollegeById);

module.exports = router;