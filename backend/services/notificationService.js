const Notification = require('../models/Notification');
const User = require('../models/User');
const ExamDeadline = require('../models/ExamDeadline');

class NotificationService {
  /**
   * Get user notifications with pagination and filters
   */
  static async getUserNotifications(userId, options = {}) {
    try {
      // Get user details to check their stream
      const user = await User.findById(userId).select('stream');
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const result = await Notification.getUserNotifications(userId, user.stream, options);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return {
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message
      };
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId) {
    try {
      // Get user details to check their stream
      const user = await User.findById(userId).select('stream');
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const count = await Notification.getUnreadCount(userId, user.stream);
      return {
        success: true,
        data: { count }
      };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return {
        success: false,
        message: 'Failed to fetch unread count',
        error: error.message
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    try {
      const updated = await Notification.markAsRead(notificationId, userId);
      
      if (!updated) {
        return {
          success: false,
          message: 'Notification not found or already read'
        };
      }

      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message
      };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    try {
      // Get user details to check their stream
      const user = await User.findById(userId).select('stream');
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const updatedCount = await Notification.markAllAsRead(userId, user.stream);

      return {
        success: true,
        message: `${updatedCount} notifications marked as read`
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error.message
      };
    }
  }

  /**
   * Delete notification for a user
   */
  static async deleteNotification(notificationId, userId) {
    try {
      const deleted = await Notification.markAsDeleted(notificationId, userId);

      if (!deleted) {
        return {
          success: false,
          message: 'Notification not found or already deleted'
        };
      }

      return {
        success: true,
        message: 'Notification deleted'
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        message: 'Failed to delete notification',
        error: error.message
      };
    }
  }

  /**
   * Create a general notification
   */
  static async createNotification(userId, notificationData) {
    try {
      const notification = new Notification({
        userId,
        ...notificationData
      });

      await notification.save();
      
      return {
        success: true,
        data: notification
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        message: 'Failed to create notification',
        error: error.message
      };
    }
  }

  /**
   * Create exam deadline notifications for all relevant users
   */
  static async createExamDeadlineNotifications() {
    try {
      const today = new Date();
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      // First, clean up expired notifications where deadline date has passed
      const cleanupResult = await this.cleanupExpiredDeadlineNotifications();
      if (cleanupResult.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanupResult.deletedCount} expired deadline notifications`);
      }

      // Get all exam deadlines with upcoming dates
      const upcomingDeadlines = await ExamDeadline.getUpcomingDeadlines(7);
      
      for (const examDeadline of upcomingDeadlines) {
        const exam = examDeadline.exam;
        
        // Check each type of deadline
        const deadlineTypes = [
          { type: 'application_deadline', date: examDeadline.applicationEndDate },
          { type: 'exam_date', date: examDeadline.examDate },
          { type: 'admit_card', date: examDeadline.admitCardDate },
          { type: 'result_date', date: examDeadline.resultDate }
        ];
        
        for (const deadline of deadlineTypes) {
          if (!deadline.date) continue; // Skip if date is not set
          
          const daysRemaining = Math.ceil((deadline.date - today) / (1000 * 60 * 60 * 24));
          
          // Only create/update notifications for deadlines 1, 3, or 7 days away
          if ([1, 3, 7].includes(daysRemaining)) {
            // Check if notification already exists
            const existingNotification = await Notification.findOne({
              exam: exam._id,
              examDeadline: examDeadline._id,
              type: deadline.type,
              deadlineDate: deadline.date
            });
            
            if (existingNotification) {
              // Update existing notification with new days remaining and message
              await this.updateExistingNotification(existingNotification, daysRemaining);
              console.log(`Updated ${deadline.type} notification for ${exam.name} (${daysRemaining} days)`);
            } else {
              // Create new notification
              await Notification.createExamDeadlineNotification({
                examId: exam._id,
                examDeadlineId: examDeadline._id,
                type: deadline.type,
                deadlineDate: deadline.date
              });
              console.log(`Created ${deadline.type} notification for ${exam.name} (${daysRemaining} days)`);
            }
          }
        }
      }
      
      console.log('Exam deadline notifications processed successfully');
    } catch (error) {
      console.error('Error creating exam deadline notifications:', error);
      throw error;
    }
  }

  /**
   * Update existing notification with new days remaining
   */
  static async updateExistingNotification(notification, newDaysRemaining) {
    try {
      const exam = await notification.populate('exam');
      
      let title, message;
      
      switch (notification.type) {
        case 'application_deadline':
          title = `${exam.exam.name} - Application Deadline Approaching`;
          message = `Only ${newDaysRemaining} days left to apply for ${exam.exam.name}. Don't miss out!`;
          break;
        case 'exam_date':
          title = `${exam.exam.name} - Exam Date Approaching`;
          message = `${exam.exam.name} exam is scheduled in ${newDaysRemaining} days. Start your final preparations!`;
          break;
        case 'admit_card':
          title = `${exam.exam.name} - Admit Card Available`;
          message = `Admit card for ${exam.exam.name} is now available. Download it before the exam!`;
          break;
        case 'result_date':
          title = `${exam.exam.name} - Results Expected`;
          message = `Results for ${exam.exam.name} are expected to be announced in ${newDaysRemaining} days.`;
          break;
        default:
          title = `${exam.exam.name} - Important Update`;
          message = `Important deadline approaching for ${exam.exam.name} in ${newDaysRemaining} days.`;
      }

      // Update the notification
      await Notification.updateOne(
        { _id: notification._id },
        {
          $set: {
            title,
            message,
            daysRemaining: newDaysRemaining,
            priority: newDaysRemaining <= 3 ? 'high' : newDaysRemaining <= 7 ? 'medium' : 'low',
            updatedAt: new Date()
          }
        }
      );

      return true;
    } catch (error) {
      console.error('Error updating existing notification:', error);
      throw error;
    }
  }

  /**
   * Clean up notifications where deadline date has passed
   */
  static async cleanupExpiredDeadlineNotifications() {
    try {
      const today = new Date();
      
      // Find all notifications where deadline date has passed
      const expiredNotifications = await Notification.find({
        deadlineDate: { $lt: today }
      });

      if (expiredNotifications.length > 0) {
        // Delete expired notifications
        const result = await Notification.deleteMany({
          deadlineDate: { $lt: today }
        });

        console.log(`Deleted ${result.deletedCount} expired deadline notifications`);
      }

      return {
        success: true,
        deletedCount: expiredNotifications.length
      };
    } catch (error) {
      console.error('Error cleaning up expired deadline notifications:', error);
      throw error;
    }
  }

  /**
   * Clean up old notifications (keeps the existing cleanup for old deleted notifications)
   */
  static async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Clean up old deleted notifications
      const deletedResult = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        'deletedBy.0': { $exists: true } // Has at least one user who deleted it
      });

      // Also clean up expired deadline notifications (redundant call but ensures cleanup)
      const expiredResult = await this.cleanupExpiredDeadlineNotifications();

      console.log(`Cleaned up ${deletedResult.deletedCount} old deleted notifications`);
      console.log(`Cleaned up ${expiredResult.deletedCount} expired deadline notifications`);
      
      return {
        success: true,
        message: `Cleaned up ${deletedResult.deletedCount} old notifications and ${expiredResult.deletedCount} expired deadline notifications`,
        deletedCount: deletedResult.deletedCount,
        expiredCount: expiredResult.deletedCount
      };
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      return {
        success: false,
        message: 'Failed to clean up old notifications',
        error: error.message
      };
    }
  }
}

module.exports = NotificationService;