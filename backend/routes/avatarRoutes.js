const express = require('express');
const { proxyGoogleAvatar, getAvatarInfo, healthCheck } = require('../controllers/avatarController');
const { wrapAsync } = require('../utils/middleware');
const router = express.Router();

/**
 * Avatar Routes
 * @route /api/avatar
 */

// Proxy Google avatar images to bypass CORS
router.get('/google/:userId', wrapAsync(proxyGoogleAvatar));

// Get user avatar information
router.get('/info/:userId', wrapAsync(getAvatarInfo));

// Health check for avatar service
router.get('/health', wrapAsync(healthCheck));

module.exports = router;