class HttpError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.isOperational = true; // Distinguish operational errors from programming errors
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // Static methods for common HTTP errors
  static badRequest(message = 'Bad Request', errors = []) {
    return new HttpError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized', errors = []) {
    return new HttpError(message, 401, errors);
  }

  static forbidden(message = 'Forbidden', errors = []) {
    return new HttpError(message, 403, errors);
  }

  static notFound(message = 'Not Found', errors = []) {
    return new HttpError(message, 404, errors);
  }

  static conflict(message = 'Conflict', errors = []) {
    return new HttpError(message, 409, errors);
  }

  static validationError(message = 'Validation Error', errors = []) {
    return new HttpError(message, 422, errors);
  }

  static internalServer(message = 'Internal Server Error', errors = []) {
    return new HttpError(message, 500, errors);
  }

  // Convert to JSON response format
  toJSON() {
    return {
      status: 'error',
      message: this.message,
      errors: this.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }
}

module.exports = HttpError;
