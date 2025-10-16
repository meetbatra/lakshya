import { useAuth } from '../modules/user/store/userStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class NotificationAPI {
  /**
   * Get authentication token from auth store
   */
  static getAuthToken() {
    return useAuth.getState().token;
  }

  /**
   * Get user notifications with filters
   */
  static async getUserNotifications(options = {}) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const {
        unreadOnly = false,
        type = null
      } = options;

      const params = new URLSearchParams({
        unreadOnly: unreadOnly.toString()
      });

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${API_BASE_URL}/notifications?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get unread notification count for current user
   */
  static async getUnreadCount() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark notification as read');
      }

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Mark notification as seen
   */
  static async markAsSeen(notificationId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/seen`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark notification as seen');
      }

      return data;
    } catch (error) {
      console.error('Error marking notification as seen:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark all notifications as read');
      }

      return data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Mark all notifications as seen (when opening notification center)
   */
  static async markAllAsSeen() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-seen`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark all notifications as seen');
      }

      return data;
    } catch (error) {
      console.error('Error marking all notifications as seen:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete notification');
      }

      return data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Create test notification (development only)
   */
  static async createTestNotification() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create test notification');
      }

      return data;
    } catch (error) {
      console.error('Error creating test notification:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Trigger exam deadline notifications (development only)
   */
  static async triggerExamDeadlineNotifications() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/notifications/trigger-exam-deadlines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to trigger exam deadline notifications');
      }

      return data;
    } catch (error) {
      console.error('Error triggering exam deadline notifications:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default NotificationAPI;