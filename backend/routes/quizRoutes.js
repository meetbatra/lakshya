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

// Class 12 PCM Field Recommendation Quiz routes
router.get('/class12/pcm', wrapAsync(quizController.getClass12PCMQuiz));
router.post('/class12/pcm/submit', wrapAsync(quizController.submitClass12PCMQuiz));

// Class 12 PCB Field Recommendation Quiz routes
router.get('/class12/pcb', wrapAsync(quizController.getClass12PCBQuiz));
router.post('/class12/pcb/submit', wrapAsync(quizController.submitClass12PCBQuiz));

// Class 12 Commerce Field Recommendation Quiz routes
router.get('/class12/commerce', wrapAsync(quizController.getClass12CommerceQuiz));
router.post('/class12/commerce/submit', wrapAsync(quizController.submitClass12CommerceQuiz));

// Class 12 Arts Field Recommendation Quiz routes
router.get('/class12/arts', wrapAsync(quizController.getClass12ArtsQuiz));
router.post('/class12/arts/submit', wrapAsync(quizController.submitClass12ArtsQuiz));

module.exports = router;
