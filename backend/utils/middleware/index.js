// Middleware utilities index
const wrapAsync = require('./wrapAsync');
const { authenticateToken } = require('./auth');

module.exports = {
  wrapAsync,
  authenticateToken
};
