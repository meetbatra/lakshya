const axios = require('axios');
const User = require('../models/User');

/**
 * Avatar Service
 * Handles avatar-related business logic
 */

/**
 * Proxy Google avatar to bypass CORS issues
 * @param {string} userId - User ID to fetch avatar for
 * @returns {Object} Avatar stream response or error
 */
const proxyGoogleAvatar = async (userId) => {
  // Validate userId
  if (!userId) {
    return {
      success: false,
      status: 400,
      error: 'User ID is required'
    };
  }

  // Get user from database
  const user = await User.findById(userId);
  
  if (!user) {
    return {
      success: false,
      status: 404,
      error: 'User not found'
    };
  }

  if (!user.avatar) {
    return {
      success: false,
      status: 404,
      error: 'Avatar not found'
    };
  }

  // Only proxy Google avatars
  if (!user.avatar.includes('googleusercontent.com')) {
    return {
      success: false,
      status: 400,
      error: 'Not a Google avatar'
    };
  }

  // Fetch the image from Google
  const response = await axios.get(user.avatar, {
    responseType: 'stream',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Lakshya/1.0)'
    },
    timeout: 10000 // 10 second timeout
  });

  return {
    success: true,
    status: 200,
    data: {
      stream: response.data,
      contentType: response.headers['content-type'] || 'image/jpeg',
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*'
      }
    }
  };
};

/**
 * Get user avatar URL
 * @param {string} userId - User ID
 * @returns {Object} Avatar URL or error
 */
const getUserAvatarUrl = async (userId) => {
  if (!userId) {
    return {
      success: false,
      status: 400,
      error: 'User ID is required'
    };
  }

  const user = await User.findById(userId).select('avatar name');
  
  if (!user) {
    return {
      success: false,
      status: 404,
      error: 'User not found'
    };
  }

  return {
    success: true,
    status: 200,
    data: {
      avatarUrl: user.avatar || null,
      hasGoogleAvatar: user.avatar ? user.avatar.includes('googleusercontent.com') : false,
      userName: user.name
    }
  };
};

module.exports = {
  proxyGoogleAvatar,
  getUserAvatarUrl
};