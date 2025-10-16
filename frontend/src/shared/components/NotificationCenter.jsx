import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faTimes, 
  faClock,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationAPI from '@/services/notificationAPI';
import { useAuth } from '@/modules/user';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch unread count on component mount and periodically
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Refresh unread count every 5 minutes instead of 30 seconds to reduce API calls
      const interval = setInterval(fetchUnreadCount, 5 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      // Clear notifications when user is not authenticated
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && isAuthenticated && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated]);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    // Check if we have a token from auth store
    const { token } = useAuth.getState();
    if (!token) {
      console.warn('No authentication token found in auth store');
      return;
    }
    
    try {
      const result = await NotificationAPI.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.data.count);
      } else {
        // If API call fails, don't spam the console or retry immediately
        console.warn('Failed to fetch unread count:', result.message);
      }
    } catch (error) {
      console.warn('Error fetching unread count:', error.message);
    }
  };

  const fetchNotifications = async () => {
    if (loading || !isAuthenticated) return;
    
    setLoading(true);
    try {
      const result = await NotificationAPI.getUserNotifications();

      if (result.success) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      } else {
        console.warn('Failed to fetch notifications:', result.message);
        // If unauthorized, clear notifications to prevent retries
        if (result.message?.includes('token') || result.message?.includes('Unauthorized')) {
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.warn('Error fetching notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigate to exam details page
    if (notification.exam) {
      navigate(`/exams/${notification.exam._id || notification.exam}`);
      setIsOpen(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const result = await NotificationAPI.markAsRead(notificationId);
      if (result.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'application_deadline': return '📝';
      case 'exam_date': return '📅';
      case 'admit_card': return '🎫';
      case 'result_date': return '�';
      default: return '🔔';
    }
  };

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diff = now - notificationTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notificationTime.toLocaleDateString();
  };

  if (!isAuthenticated || !useAuth.getState().token) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 min-w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white border-2 border-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications List with Overflow */}
          <div className="flex-1 overflow-y-auto min-h-0">{/* Added min-h-0 for proper flex behavior */}
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5 mb-2" />
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FontAwesomeIcon icon={faBell} className="w-8 h-8 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">We'll notify you when something important happens</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">
                            {notification.icon || getTypeIcon(notification.type)}
                          </span>
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          
                          <FontAwesomeIcon 
                            icon={faExternalLinkAlt} 
                            className="w-3 h-3 text-gray-400" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;