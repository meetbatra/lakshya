const express = require('express');
const router = express.Router();

// Import controllers and utilities
const quizController = require('../controllers/quizController');
const { wrapAsync } = require('../utils/middleware');

// Routes will be added here with wrapAsync
// router.get('/', wrapAsync(quizController.getQuizzes));
// router.get('/:id', wrapAsync(quizController.getQuizById));
// router.post('/:id/submit', wrapAsync(quizController.submitQuiz));

module.exports = router;
