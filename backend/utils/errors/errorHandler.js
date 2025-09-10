const HttpError = require('./HttpError');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error for debugging
  console.error(`${error.name}: ${error.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  // Convert common errors to HttpError
  if (!(error instanceof HttpError)) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      error = HttpError.conflict(message, [`This ${field} is already registered`]);
    }
    // MongoDB validation error
    else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      error = HttpError.validationError('Validation failed', errors);
    }
    // MongoDB cast error (invalid ObjectId)
    else if (error.name === 'CastError') {
      error = HttpError.badRequest('Invalid ID format');
    }
    // JWT errors
    else if (error.name === 'JsonWebTokenError') {
      error = HttpError.unauthorized('Invalid token');
    }
    else if (error.name === 'TokenExpiredError') {
      error = HttpError.unauthorized('Token expired');
    }
    // SyntaxError (malformed JSON)
    else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      error = HttpError.badRequest('Invalid JSON format');
    }
    // Default internal server error
    else {
      error = HttpError.internalServer(
        process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
        process.env.NODE_ENV === 'development' ? [error.message] : []
      );
    }
  }

  // Send error response
  res.status(error.statusCode).json(error.toJSON());
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
  const error = HttpError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
