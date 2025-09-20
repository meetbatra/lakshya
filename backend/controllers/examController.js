const examService = require('../services/examService');

// Get all exams with optional filtering and search
const getAllExams = async (req, res) => {
  const options = req.query;
  const result = await examService.getAllExams(options);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

// Get exam by ID
const getExamById = async (req, res) => {
  const { id } = req.params;
  const result = await examService.getExamById(id);

  if (result.success) {
    res.json(result);
  } else {
    const statusCode = result.message === 'Exam not found' ? 404 : 500;
    res.status(statusCode).json(result);
  }
};

// Get filter options (streams, exam months)
const getFilterOptions = async (req, res) => {
  const result = await examService.getFilterOptions();

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

// Get exams statistics
const getExamStats = async (req, res) => {
  const result = await examService.getExamStats();

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

// Create a new exam
const createExam = async (req, res) => {
  const result = await examService.createExam(req.body);

  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
};

// Update exam by ID
const updateExam = async (req, res) => {
  const { id } = req.params;
  const result = await examService.updateExam(id, req.body);

  if (result.success) {
    res.json(result);
  } else {
    const statusCode = result.message === 'Exam not found' ? 404 : 400;
    res.status(statusCode).json(result);
  }
};

// Delete exam by ID (soft delete)
const deleteExam = async (req, res) => {
  const { id } = req.params;
  const result = await examService.deleteExam(id);

  if (result.success) {
    res.json(result);
  } else {
    const statusCode = result.message === 'Exam not found' ? 404 : 500;
    res.status(statusCode).json(result);
  }
};

module.exports = {
  getAllExams,
  getExamById,
  getFilterOptions,
  getExamStats,
  createExam,
  updateExam,
  deleteExam
};