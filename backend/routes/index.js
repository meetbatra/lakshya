const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const quizRoutes = require('./quizRoutes');
const dailyQuizRoutes = require('./dailyQuizRoutes');
const courseRoutes = require('./courseRoutes');
const collegeRoutes = require('./collegeRoutes');
const examRoutes = require('./examRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount routes with their base paths
router.use('/auth', authRoutes);
router.use('/quiz', quizRoutes);
router.use('/daily-quiz', dailyQuizRoutes);
router.use('/courses', courseRoutes);
router.use('/colleges', collegeRoutes);
router.use('/exams', examRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/notifications', notificationRoutes);

// Health check route (can be moved here or kept in app.js)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Lakshya API is running!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
