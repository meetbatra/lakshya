const collegeService = require('../services/collegeService');

// Get all colleges with optional filtering and search
const getAllColleges = async (req, res) => {
  const options = req.query;
  const result = await collegeService.getAllColleges(options);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

// Get college by ID
const getCollegeById = async (req, res) => {
  const { id } = req.params;
  const result = await collegeService.getCollegeById(id);

  if (result.success) {
    res.json(result);
  } else {
    const statusCode = result.message === 'College not found' ? 404 : 500;
    res.status(statusCode).json(result);
  }
};

// Get filter options (states, cities, types)
const getFilterOptions = async (req, res) => {
  const result = await collegeService.getFilterOptions();

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

// Get colleges statistics
const getCollegeStats = async (req, res) => {
  const result = await collegeService.getCollegeStats();

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

module.exports = {
  getAllColleges,
  getCollegeById,
  getFilterOptions,
  getCollegeStats
};
