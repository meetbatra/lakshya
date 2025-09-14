const courseService = require('../services/courseService');

/**
 * Course Controller - Handles HTTP requests for course-related operations
 */

/**
 * GET /api/courses
 * Get all courses with optional filtering
 */
const getAllCourses = async (req, res) => {
  const { stream, field, level } = req.query;
  const filters = {};
  
  if (stream) filters.stream = stream;
  if (field) filters.field = field;
  if (level) filters.level = level;

  const result = await courseService.getAllCourses(filters);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

/**
 * GET /api/courses/stream/:stream
 * Get courses by stream (for Class 10 quiz results)
 */
const getCoursesByStream = async (req, res) => {
  const { stream } = req.params;
  
  const result = await courseService.getCoursesByStream(stream);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

/**
 * GET /api/courses/field/:field
 * Get courses by field (for Class 12 quiz results)
 */
const getCoursesByField = async (req, res) => {
  const { field } = req.params;
  
  const result = await courseService.getCoursesByField(field);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

/**
 * GET /api/courses/:id
 * Get course by ID
 */
const getCourseById = async (req, res) => {
  const { id } = req.params;
  
  const result = await courseService.getCourseById(id);
  
  if (!result.success) {
    return res.status(404).json(result);
  }
  
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

/**
 * GET /api/courses/ai-recommended/field/:field
 * Get AI-recommended courses by field (enhanced version)
 */
const getAIRecommendedCoursesByField = async (req, res) => {
  const { field } = req.params;
  
  const result = await courseService.getAIRecommendedCoursesByField(field);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

module.exports = {
  getAllCourses,
  getCoursesByStream,
  getCoursesByField,
  getAIRecommendedCoursesByField,
  getCourseById
};
