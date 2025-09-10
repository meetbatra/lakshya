// Main utils index - provides access to all utilities
const auth = require('./auth');
const database = require('./database');
const errors = require('./errors');
const middleware = require('./middleware');
const services = require('./services');
const validation = require('./validation');

module.exports = {
  auth,
  database,
  errors,
  middleware,
  services,
  validation,
  
  // Direct exports for backward compatibility
  ...auth,
  ...database,
  ...errors,
  ...middleware,
  ...services,
  ...validation
};
