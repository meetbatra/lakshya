// External services utilities index
const geminiService = require('./geminiService');
const aiCourseService = require('./aiCourseService');

module.exports = {
  ...geminiService,
  ...aiCourseService
};
