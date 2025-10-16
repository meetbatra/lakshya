const express = require('express');
const router = express.Router();
const DailyQuizController = require('../controllers/dailyQuizController');
const { authenticateToken } = require('../utils/middleware');

// All quiz routes require authentication
router.use(authenticateToken);

// Daily Quiz Routes
router.get('/daily', DailyQuizController.getDailyQuiz);
router.get('/status', DailyQuizController.getQuizStatus);
router.post('/submit', DailyQuizController.submitQuiz);

// Custom Quiz Routes
router.post('/custom', DailyQuizController.getCustomQuiz);
router.get('/question-counts', DailyQuizController.getQuestionCounts);

// Analytics and History
router.get('/analytics', DailyQuizController.getAnalytics);
router.get('/history', DailyQuizController.getQuizHistory);
router.get('/results/:attemptId', DailyQuizController.getQuizResults);

// Leaderboard
router.get('/leaderboard', DailyQuizController.getLeaderboard);

// Development/Debug Routes
router.get('/today-config', DailyQuizController.getTodayConfig);

module.exports = router;