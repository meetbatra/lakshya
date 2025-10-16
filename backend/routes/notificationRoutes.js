const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../utils/middleware');

// All notification routes require authentication
router.use(authenticateToken);

// Get user notifications with pagination and filters
router.get('/', NotificationController.getUserNotifications);

// Get unread notification count
router.get('/unread-count', NotificationController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', NotificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', NotificationController.markAllAsRead);

// Delete notification
router.delete('/:id', NotificationController.deleteNotification);

// Development/testing endpoints
if (process.env.NODE_ENV === 'development') {
  // Test auth endpoint
  router.get('/test-auth', (req, res) => {
    res.json({
      success: true,
      message: 'Authentication working!',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
      }
    });
  });
  
  // Create test notification
  router.post('/test', NotificationController.createTestNotification);
  
  // Trigger exam deadline notifications manually
  router.post('/trigger-exam-deadlines', NotificationController.triggerExamDeadlineNotifications);
}

module.exports = router;