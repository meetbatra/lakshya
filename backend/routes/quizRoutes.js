const express = require('express');
const router = express.Router();

// Import controllers and utilities
const quizController = require('../controllers/quizController');
const { wrapAsync } = require('../utils/middleware');

/**
 * Quiz Routes for Lakshya Application
 * Base path: /api/quiz
 */

// Health check endpoint
router.get('/health', wrapAsync(quizController.healthCheck));

// Get all available quizzes for a specific class
router.get('/available/:class', wrapAsync(quizController.getAvailableQuizzes));

// Class 10 Stream Selection Quiz routes
router.get('/class10', wrapAsync(quizController.getClass10Quiz));
router.post('/class10/submit', wrapAsync(quizController.submitClass10Quiz));

// TODO: Class 12 quiz routes will be added here
// router.get('/class12/science-pcm', wrapAsync(quizController.getClass12SciencePCMQuiz));
// router.get('/class12/science-pcb', wrapAsync(quizController.getClass12SciencePCBQuiz));
// router.get('/class12/commerce', wrapAsync(quizController.getClass12CommerceQuiz));
// router.get('/class12/arts', wrapAsync(quizController.getClass12ArtsQuiz));
// router.post('/class12/:stream/submit', wrapAsync(quizController.submitClass12Quiz));

module.exports = router;
