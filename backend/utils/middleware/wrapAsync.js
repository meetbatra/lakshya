// Async wrapper for Express route handlers
// Catches async/await errors and passes them to Express error handler
const wrapAsync = (fn) => {
  return (req, res, next) => {
    // Execute the async function and catch any errors
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = wrapAsync;