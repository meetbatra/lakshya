const express = require('express');
const router = express.Router();

// Import controllers and utilities
const examController = require('../controllers/examController');
const { wrapAsync } = require('../utils/middleware');

// GET /api/exams - Get all exams with filtering and search
router.get('/', wrapAsync(examController.getAllExams));

// GET /api/exams/stats - Get exam statistics
router.get('/stats', wrapAsync(examController.getExamStats));

// GET /api/exams/filters - Get filter options
router.get('/filters', wrapAsync(examController.getFilterOptions));

// GET /api/exams/:id - Get exam by ID
router.get('/:id', wrapAsync(examController.getExamById));

// POST /api/exams - Create a new exam (for admin use)
router.post('/', wrapAsync(examController.createExam));

// PUT /api/exams/:id - Update exam by ID (for admin use)
router.put('/:id', wrapAsync(examController.updateExam));

// DELETE /api/exams/:id - Delete exam by ID (for admin use)
router.delete('/:id', wrapAsync(examController.deleteExam));

module.exports = router;