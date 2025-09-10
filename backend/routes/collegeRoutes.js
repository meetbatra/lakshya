const express = require('express');
const router = express.Router();

// Import controllers and utilities
const collegeController = require('../controllers/collegeController');
const { wrapAsync } = require('../utils/middleware');

// Routes will be added here with wrapAsync
// router.get('/', wrapAsync(collegeController.getColleges));
// router.get('/:id', wrapAsync(collegeController.getCollegeById));
// router.get('/search', wrapAsync(collegeController.searchColleges));

module.exports = router;
