const jwt = require('jsonwebtoken');
const { HttpError } = require('../errors');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw HttpError.unauthorized('Access token required');
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw HttpError.unauthorized('Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      throw HttpError.unauthorized('Token expired');
    } else {
      throw HttpError.unauthorized('Invalid or expired token');
    }
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken
};
