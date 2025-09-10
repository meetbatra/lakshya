const express = require('express');
const router = express.Router();

// Import controllers and utilities
const courseController = require('../controllers/courseController');
const { wrapAsync } = require('../utils/middleware');

// Routes will be added here with wrapAsync
// router.get('/', wrapAsync(courseController.getCourses));
// router.get('/:id', wrapAsync(courseController.getCourseById));
// router.get('/:id/careers', wrapAsync(courseController.getCourseCareerOptions));

module.exports = router;
