import React, { useEffect, useState } from 'react';
import { setupNotificationListener, registerForNotifications } from '../../services/notificationService';
import { useStore } from '../../store/useStore';
import './NotificationComponent.css';
import { apiClient } from '../../lib/api-client';
import { FaBell, FaCheckCircle, FaRegBell, FaInfo, FaTools, FaClipboardCheck, FaComments, FaTasks, FaEllipsisH } from 'react-icons/fa';

const NotificationComponent = ({ inPage = false }) => {
  const { user } = useStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Function to fetch notifications from database
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userType = user.role === 'student' ? 'student' : 'faculty';
      const userId = user.role === 'student' ? user.studentID : user.facultyID;
      
      const response = await apiClient.get(
        `/api/notifications/user/${userType}/${userId}`,
        { 
          withCredentials: true,
          validateStatus: function (status) {
            return true; 
          }
        }
      );
      
      if (response.status === 200 && response.data.success) {
        const fetchedNotifications = response.data.notifications.map(notification => {
          // Extract first 80 characters of body text for preview
          const shortBody = notification.body.length > 80 
            ? notification.body.substring(0, 80) + '...' 
            : notification.body;
            
          // Create a simplified notification object
          return {
            id: notification._id,
            title: notification.title,
            body: shortBody,
            fullBody: notification.body, // Keep full body for expanded view
            time: formatTimeAgo(new Date(notification.createdAt)),
            date: new Date(notification.createdAt),
            isRead: notification.isRead[userId] || false,
            type: notification.type || 'general'
          };
        });
        
        const notificationsToShow = inPage ? 
          fetchedNotifications : 
          fetchedNotifications.slice(0, 5);
          
        setNotifications(notificationsToShow);
      } else {
        console.log('Could not fetch notifications or empty response');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format time to "X time ago" format
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Register for push notifications
  const registerForPushNotifications = async () => {
    if (!user || isRegistered) return;
    
    try {
      const success = await registerForNotifications();
      if (success) {
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  // Mark notification as read - with error handling
  const markAsRead = async (id) => {
    if (!user) return;
    
    try {
      const userId = user.role === 'student' ? user.studentID : user.facultyID;
      
      const response = await apiClient.put(
        `/api/notifications/${id}/read`,
        { userId },
        { 
          withCredentials: true,
          validateStatus: function (status) {
            return true; 
          }
        }
      );
      
      if (response.status === 200) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read - with error handling
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      const userId = user.role === 'student' ? user.studentID : user.facultyID;
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      if (unreadNotifications.length === 0) return;
      
      let anySucceeded = false;
      
      const results = await Promise.allSettled(
        unreadNotifications.map(notification => 
          apiClient.put(
            `/api/notifications/${notification.id}/read`,
            { userId },
            { 
              withCredentials: true,
              validateStatus: function (status) {
                return true;
              }
            }
          )
        )
      );
      
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.status === 200) {
          anySucceeded = true;
        }
      });
      
      if (anySucceeded) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleNotificationsPanel = () => {
    if (!inPage) {
      setShowNotifications(prev => !prev);
    }
  };

  // Get the count of unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    let content = '';
    
    switch (type) {
      case 'project':
        content = 'P';
        break;
      case 'activity':
        content = 'A';
        break;
      case 'forum':
        content = 'F';
        break;
      case 'review':
        content = 'R';
        break;
      default:
        content = 'N';
    }
    
    return (
      <div className="notification-avatar">
        {content}
      </div>
    );
  };

  useEffect(() => {
    // Set up push notification listener
    setupNotificationListener((payload) => {
      const newNotification = {
        id: Date.now().toString(),
        title: payload.notification.title,
        body: payload.notification.body.length > 80 
          ? payload.notification.body.substring(0, 80) + '...' 
          : payload.notification.body,
        fullBody: payload.notification.body,
        time: 'Just now',
        date: new Date(),
        isRead: false,
        type: payload.data?.type || 'general'
      };
      setNotifications(prev => [newNotification, ...prev]);
    });
    
    // Fetch notifications from database when user changes
    if (user) {
      fetchNotifications();
      registerForPushNotifications();
      
      // Set up periodic refresh for notifications
      const refreshInterval = setInterval(() => {
        fetchNotifications();
      }, 60000); // Refresh every minute
      
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  // Group notifications by date for inPage view
  const groupNotificationsByDate = () => {
    const groups = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Earlier': []
    };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    filteredNotifications.forEach(notification => {
      const notifDate = new Date(notification.date);
      notifDate.setHours(0, 0, 0, 0);
      
      if (notifDate.getTime() === today.getTime()) {
        groups['Today'].push(notification);
      } else if (notifDate.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(notification);
      } else if (notifDate >= oneWeekAgo) {
        groups['This Week'].push(notification);
      } else {
        groups['Earlier'].push(notification);
      }
    });
    
    return groups;
  };

  // For in-page display
  if (inPage) {
    const notificationGroups = groupNotificationsByDate();
    
    if (notifications.length === 0 && !loading) {
      return (
        <div className="notification-fullpage-wrapper">
          <div className="notification-container">
            <div className="notification-header">
              <h1>Notifications</h1>
            </div>
            <div className="notification-tabs">
              <button 
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveTab('unread')}
              >
                Unread
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
            </div>
            <div className="notification-empty">
              <FaRegBell className="empty-icon" />
              <p className="empty-text">No notifications to display</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="notification-fullpage-wrapper">
        <div className="notification-container">
          <div className="notification-header">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <div className="notification-actions">
                <button 
                  onClick={markAllAsRead}
                  className="action-button"
                >
                  <FaCheckCircle />
                  Mark all as read
                </button>
              </div>
            )}
          </div>
          
          <div className="notification-tabs">
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
          </div>
          
          {loading ? (
            <div className="notification-loading">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : (
            <div className="notification-list">
              {Object.entries(notificationGroups).map(([group, groupNotifications]) => {
                if (groupNotifications.length === 0) return null;
                
                return (
                  <div key={group} className="notification-group">
                    <h3 className="group-header">{group}</h3>
                    {groupNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`notification ${notification.isRead ? 'read' : 'unread'}`}
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                      >
                        {getNotificationIcon(notification.type)}
                        <div className="notification-content">
                          <div className="notification-title">{notification.title}</div>
                          <div className="notification-message">{notification.fullBody}</div>
                          <div className="notification-time">{notification.time}</div>
                        </div>
                        <button
                          className="close-button"
                          onClick={(e) => removeNotification(notification.id, e)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // For dropdown notification display (not in-page)
  return (
    <div className="notification-dropdown">
      <div className="notification-bell" onClick={toggleNotificationsPanel}>
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {showNotifications && (
        <div className="notification-dropdown-content">
          <div className="notification-header">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="action-button">
                <FaCheckCircle />
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-tabs">
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
          </div>

          {loading ? (
            <div className="notification-loading">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <>
              <div className="notification-list">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification ${notification.isRead ? 'read' : 'unread'}`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    {getNotificationIcon(notification.type)}
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.body}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                    <button
                      className="close-button"
                      onClick={(e) => removeNotification(notification.id, e)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <a href={user?.role === 'student' ? '/student/notifications' : '/faculty/Notifications'}>
                  View all notifications
                </a>
              </div>
            </>
          ) : (
            <div className="notification-empty">
              <FaRegBell className="empty-icon" />
              <p className="empty-text">No notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent; 