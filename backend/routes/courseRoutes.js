const express = require('express');
const router = express.Router();

// Import controllers and utilities
const courseController = require('../controllers/courseController');
const { wrapAsync } = require('../utils/middleware');

/**
 * Course Routes for Lakshya Application
 * Base path: /api/courses
 */

// Get all courses with optional filtering
router.get('/', wrapAsync(courseController.getAllCourses));

// Get courses by stream (for Class 10 quiz results)
router.get('/stream/:stream', wrapAsync(courseController.getCoursesByStream));

// Get courses by field (for Class 12 quiz results)  
router.get('/field/:field', wrapAsync(courseController.getCoursesByField));

// Get AI-recommended courses by field (enhanced version)
router.get('/ai-recommended/field/:field', wrapAsync(courseController.getAIRecommendedCoursesByField));

// Get course by ID (must be last to avoid conflicts)
router.get('/:id', wrapAsync(courseController.getCourseById));

module.exports = router;
