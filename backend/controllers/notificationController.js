const NotificationService = require('../services/notificationService');
const { wrapAsync } = require('../utils/middleware');

class NotificationController {
  /**
   * Get user notifications
   * GET /api/notifications
   * Query params: unreadOnly, type
   */
  static getUserNotifications = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const {
      unreadOnly = false,
      type = null
    } = req.query;

    const options = {
      unreadOnly: unreadOnly === 'true',
      type: type || null
    };

    const result = await NotificationService.getUserNotifications(userId, options);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  });

  /**
   * Get unread notification count
   * GET /api/notifications/unread-count
   */
  static getUnreadCount = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await NotificationService.getUnreadCount(userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  });

  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   */
  static markAsRead = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await NotificationService.markAsRead(id, userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  });

  /**
   * Mark all notifications as read
   * PUT /api/notifications/mark-all-read
   */
  static markAllAsRead = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await NotificationService.markAllAsRead(userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  });

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  static deleteNotification = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await NotificationService.deleteNotification(id, userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  });

  /**
   * Create a test notification (for development)
   * POST /api/notifications/test
   */
  static createTestNotification = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    
    const testNotification = {
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working correctly.',
      type: 'general',
      priority: 'medium',
      metadata: {
        icon: '🔔',
        actionUrl: '/dashboard'
      }
    };

    const result = await NotificationService.createNotification(userId, testNotification);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(201).json(result);
  });

  /**
   * Trigger exam deadline notifications manually (for testing)
   * POST /api/notifications/trigger-exam-deadlines
   */
  static triggerExamDeadlineNotifications = wrapAsync(async (req, res) => {
    const result = await NotificationService.createExamDeadlineNotifications();

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  });
}

module.exports = NotificationController;