// Services index - Export all service modules
const authService = require('./authService');
const avatarService = require('./avatarService');
const bookmarkService = require('./bookmarkService');
const collegeService = require('./collegeService');
const courseService = require('./courseService');
const examService = require('./examService');
const quizService = require('./quizService');

module.exports = {
  authService,
  avatarService,
  bookmarkService,
  collegeService,
  courseService,
  examService,
  quizService
};