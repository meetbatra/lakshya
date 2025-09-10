// Error handling utilities index
const HttpError = require('./HttpError');
const { errorHandler, notFoundHandler } = require('./errorHandler');

module.exports = {
  HttpError,
  errorHandler,
  notFoundHandler
};
