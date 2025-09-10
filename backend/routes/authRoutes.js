const express = require('express');
const router = express.Router();

// Import controllers, middleware, and utilities
const authController = require('../controllers/authController');
const { authenticateToken } = require('../utils/auth');
const { wrapAsync } = require('../utils/middleware');

// Public routes
router.post('/register', wrapAsync(authController.register));
router.post('/login', wrapAsync(authController.login));

// Protected routes (require authentication)
router.get('/profile', authenticateToken, wrapAsync(authController.getProfile));
router.put('/profile', authenticateToken, wrapAsync(authController.updateProfile));
router.post('/logout', authenticateToken, wrapAsync(authController.logout));

module.exports = router;
