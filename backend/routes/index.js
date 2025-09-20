const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const quizRoutes = require('./quizRoutes');
const courseRoutes = require('./courseRoutes');
const collegeRoutes = require('./collegeRoutes');
const examRoutes = require('./examRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');
const avatarRoutes = require('./avatarRoutes');

// Mount routes with their base paths
router.use('/auth', authRoutes);
router.use('/quiz', quizRoutes);
router.use('/courses', courseRoutes);
router.use('/colleges', collegeRoutes);
router.use('/exams', examRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/avatar', avatarRoutes);

// Health check route (can be moved here or kept in app.js)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Lakshya API is running!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
