// Services index - Export all service modules
const authService = require('./authService');
const bookmarkService = require('./bookmarkService');
const collegeService = require('./collegeService');
const courseService = require('./courseService');
const examService = require('./examService');
const quizService = require('./quizService');
const notificationService = require('./notificationService');

module.exports = {
  authService,
  bookmarkService,
  collegeService,
  courseService,
  examService,
  quizService,
  notificationService
};