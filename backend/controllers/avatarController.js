const { 
  proxyGoogleAvatar: proxyGoogleAvatarService, 
  getUserAvatarUrl: getUserAvatarUrlService 
} = require('../services/avatarService');

/**
 * Avatar Controller
 * Handles HTTP requests and responses for avatar operations
 */

/**
 * Proxy Google avatar to bypass CORS
 * GET /api/avatar/google/:userId
 */
const proxyGoogleAvatar = async (req, res) => {
  const { userId } = req.params;

  // Call avatar service
  const result = await proxyGoogleAvatarService(userId);

  if (!result.success) {
    return res.status(result.status).json({ 
      success: false,
      error: result.error 
    });
  }

  // Set response headers
  res.set(result.data.headers);

  // Pipe the image stream to response
  result.data.stream.pipe(res);
};

/**
 * Get user avatar information
 * GET /api/avatar/info/:userId
 */
const getAvatarInfo = async (req, res) => {
  const { userId } = req.params;

  // Call avatar service
  const result = await getUserAvatarUrlService(userId);

  if (!result.success) {
    return res.status(result.status).json({
      success: false,
      error: result.error
    });
  }

  res.status(200).json({
    success: true,
    data: result.data
  });
};

/**
 * Health check for avatar service
 * GET /api/avatar/health
 */
const healthCheck = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Avatar service is running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  proxyGoogleAvatar,
  getAvatarInfo,
  healthCheck
};