const authService = require('../services/authService');
const { HttpError } = require('../utils/errors');

// Register new user
const register = async (req, res, next) => {
  const result = await authService.registerUser(req.body);
  
  if (result.success) {
    res.status(201).json({
      status: 'success',
      message: result.message,
      data: result.data
    });
  } else {
    // Determine appropriate status code based on error type
    if (result.errors && result.errors.includes('Email is already registered')) {
      throw HttpError.conflict(result.message, result.errors);
    } else if (result.message === 'Validation failed') {
      throw HttpError.validationError(result.message, result.errors);
    } else {
      throw HttpError.badRequest(result.message, result.errors);
    }
  }
};

// Login user
const login = async (req, res, next) => {
  const result = await authService.loginUser(req.body);
  
  if (result.success) {
    res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data
    });
  } else {
    // Determine appropriate status code based on error type
    if (result.message === 'Invalid credentials') {
      throw HttpError.unauthorized(result.message, result.errors);
    } else if (result.message === 'Validation failed') {
      throw HttpError.validationError(result.message, result.errors);
    } else {
      throw HttpError.badRequest(result.message, result.errors);
    }
  }
};

// Get user profile
const getProfile = async (req, res, next) => {
  const result = await authService.getUserProfile(req.userId);
  
  if (result.success) {
    res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data
    });
  } else {
    throw HttpError.notFound(result.message, result.errors);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  const result = await authService.updateUserProfile(req.userId, req.body);
  
  if (result.success) {
    res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data
    });
  } else {
    if (result.message === 'User not found') {
      throw HttpError.notFound(result.message, result.errors);
    } else if (result.message === 'Validation failed') {
      throw HttpError.validationError(result.message, result.errors);
    } else {
      throw HttpError.badRequest(result.message, result.errors);
    }
  }
};

// Logout user (client-side token removal)
const logout = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
    data: {
      instruction: 'Please remove the token from client storage'
    }
  });
};

// Google OAuth login/signup
const googleAuth = async (req, res, next) => {
  const result = await authService.handleGoogleAuth(req.body.credential);
  
  if (result.success) {
    res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data
    });
  } else {
    if (result.message === 'Invalid Google token') {
      throw HttpError.unauthorized(result.message, result.errors);
    } else {
      throw HttpError.badRequest(result.message, result.errors);
    }
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  googleAuth
};
