import React, { useEffect, useState } from 'react';
import { setupNotificationListener, registerForNotifications } from '../../services/notificationService';
import { useStore } from '../../store/useStore';
import { apiClient } from '../../lib/api-client';
import { FaBell, FaCheckCircle, FaRegBell, FaInfo, FaTools, FaClipboardCheck, FaComments, FaTasks, FaEllipsisH, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationComponent = ({ inPage = false }) => {
  const { user } = useStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Function to determine where to navigate based on notification type
  const getNotificationRedirectUrl = (notification) => {
    // Extract any IDs from the notification body using regex
    const teamIdMatch = notification.fullBody.match(/teamId: ([A-Za-z0-9_]+)/);
    const projectIdMatch = notification.fullBody.match(/projectId: ([A-Za-z0-9_]+)/);
    const reviewIdMatch = notification.fullBody.match(/reviewId: ([A-Za-z0-9_]+)/);
    const taskIdMatch = notification.fullBody.match(/taskId: ([A-Za-z0-9_]+)/);
    
    const teamId = teamIdMatch ? teamIdMatch[1] : null;
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    const reviewId = reviewIdMatch ? reviewIdMatch[1] : null;
    const taskId = taskIdMatch ? taskIdMatch[1] : null;
    
    const isStudent = user?.role === 'student';
    const prefix = isStudent ? '/Student' : '/Faculty';
    
    // For faculty users, determine if they should go to Incharge or Guide routes
    const getFacultyRole = (notification) => {
      // Check if notification content indicates it's for a guide
      const isGuideRelated = 
        notification.fullBody.toLowerCase().includes('guide') || 
        notification.title.toLowerCase().includes('guide') ||
        notification.fullBody.toLowerCase().includes('guided') ||
        notification.fullBody.toLowerCase().includes('mentoring');
      
      // Check if notification content indicates it's for an incharge
      const isInchargeRelated = 
        notification.fullBody.toLowerCase().includes('incharge') || 
        notification.title.toLowerCase().includes('incharge') ||
        notification.fullBody.toLowerCase().includes('leading') ||
        notification.fullBody.toLowerCase().includes('project lead');
      
      // Default to Incharge if can't determine
      return isGuideRelated ? 'Guide' : 'Incharge';
    };
    
    // Get faculty role (Incharge or Guide)
    const facultyRole = !isStudent ? getFacultyRole(notification) : '';
    
    // Handle task notifications as a special case regardless of type
    if (notification.title.toLowerCase().includes('task') || 
        notification.fullBody.toLowerCase().includes('task') || 
        notification.type === 'task') {
      if (teamId) {
        return isStudent 
          ? `${prefix}/ActiveWorks/${teamId}?tab=tasks`
          : `${prefix}/ActiveWorks/${facultyRole}/${teamId}?tab=tasks`;
      }
      return isStudent 
        ? `${prefix}/ActiveWorks` 
        : `${prefix}/ActiveWorks/${facultyRole}`;
    }
    
    switch (notification.type) {
      case 'project':
        if (teamId) {
          return isStudent 
            ? `${prefix}/ActiveWorks/${teamId}`
            : `${prefix}/ActiveWorks/${facultyRole}/${teamId}`;
        }
        return isStudent 
          ? `${prefix}/ActiveWorks` 
          : `${prefix}/ActiveWorks/${facultyRole}`;
        
      case 'review':
        if (teamId) {
          return isStudent 
            ? `${prefix}/ActiveWorks/${teamId}?tab=reviews`
            : `${prefix}/ActiveWorks/${facultyRole}/${teamId}?tab=reviews`;
        }
        return isStudent 
          ? `${prefix}/ActiveWorks` 
          : `${prefix}/ActiveWorks/${facultyRole}`;
        
      case 'task':
        // This is a fallback, but the special case above should handle most task notifications
        if (teamId) {
          return isStudent 
            ? `${prefix}/ActiveWorks/${teamId}?tab=tasks`
            : `${prefix}/ActiveWorks/${facultyRole}/${teamId}?tab=tasks`;
        }
        return isStudent 
          ? `${prefix}/ActiveWorks` 
          : `${prefix}/ActiveWorks/${facultyRole}`;
        
      case 'forum':
        if (projectId) {
          return `${prefix}/ProjectForum/${projectId}`;
        }
        return `${prefix}/ProjectForum`;
        
      case 'activity':
        return `${prefix}/Dashboard`;
        
      default:
        return `${prefix}/Dashboard`;
    }
  };

  // Function to navigate to the relevant content
  const handleNotificationAction = (notification, e) => {
    if (e) e.stopPropagation();
    
    // Mark as read if not already
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Close notification panel if in dropdown mode
    if (!inPage) {
      setShowNotifications(false);
    }
    
    // Navigate to the relevant page
    const redirectUrl = getNotificationRedirectUrl(notification);
    navigate(redirectUrl);
  };

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
      <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-gray-100 text-gray-600 font-semibold text-sm flex-shrink-0">
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
      }, 10000); // Refresh every minute
      
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

  // Update notification item in dropdown view
  const renderNotificationItem = (notification) => (
    <div 
      key={notification.id} 
      className={`flex items-start gap-2 p-2 bg-white rounded-lg shadow-sm mb-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all ${notification.isRead ? '' : 'border-l-[3px] border-l-[#9b1a31] bg-rose-50'}`}
      onClick={() => !notification.isRead && markAsRead(notification.id)}
    >
      {getNotificationIcon(notification.type)}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-800 truncate">{notification.title}</div>
        <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">{notification.body}</div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-[10px] text-gray-500">{notification.time}</div>
          <button
            onClick={(e) => handleNotificationAction(notification, e)} 
            className="text-[10px] text-[#9b1a31] flex items-center gap-0.5 hover:text-[#82001A] hover:underline transition-colors"
            title="Go to related content"
          >
            <span>View</span>
            <FaExternalLinkAlt size={8} />
          </button>
        </div>
      </div>
      <button
        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
        onClick={(e) => removeNotification(notification.id, e)}
      >
        ×
      </button>
    </div>
  );

  // Update the in-page notification rendering
  const renderInPageNotificationItem = (notification) => (
    <div 
      key={notification.id} 
      className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm mb-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all ${notification.isRead ? '' : 'border-l-[3px] border-l-[#9b1a31] bg-rose-50'}`}
      onClick={() => !notification.isRead && markAsRead(notification.id)}
    >
      {getNotificationIcon(notification.type)}
      <div className="flex-1 min-w-0">
        <div className="text-xs sm:text-sm font-medium text-gray-800">{notification.title}</div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{notification.fullBody}</div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-[10px] sm:text-xs text-gray-500">{notification.time}</div>
          <button
            onClick={(e) => handleNotificationAction(notification, e)} 
            className="text-[10px] sm:text-xs text-[#9b1a31] flex items-center gap-0.5 hover:text-[#82001A] hover:underline transition-colors"
            title="Go to related content"
          >
            <span>Go to related content</span>
            <FaExternalLinkAlt size={10} />
          </button>
        </div>
      </div>
      <button
        className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
        onClick={(e) => removeNotification(notification.id, e)}
      >
        ×
      </button>
    </div>
  );

  // For in-page display
  if (inPage) {
    const notificationGroups = groupNotificationsByDate();
    
    if (notifications.length === 0 && !loading) {
      return (
        <div className="w-full p-2 sm:p-5 bg-gray-50">
          <div className="w-full max-w-[900px] mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-100">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Notifications</h1>
            </div>
            <div className="flex bg-white border-b border-gray-100">
              <button 
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === 'all' ? 'text-[#9b1a31] font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#9b1a31]' : 'text-gray-600'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === 'unread' ? 'text-[#9b1a31] font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#9b1a31]' : 'text-gray-600'}`}
                onClick={() => setActiveTab('unread')}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center ml-1 sm:ml-2 min-w-[16px] sm:min-w-[20px] h-4 sm:h-5 px-1 sm:px-1.5 py-0.5 bg-[#9b1a31] text-white text-[10px] sm:text-xs font-medium rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 sm:px-5 text-center bg-white">
              <FaRegBell className="text-3xl sm:text-4xl text-gray-300 mb-3" />
              <p className="text-xs sm:text-sm text-gray-500">No notifications to display</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full p-2 sm:p-5 bg-gray-50">
        <div className="w-full max-w-[900px] mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-100">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <div className="flex gap-1">
                <button 
                  onClick={markAllAsRead}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#9b1a31] rounded transition-colors"
                >
                  <FaCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xs:inline">Mark all as read</span>
                  <span className="xs:hidden">Mark all</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex bg-white border-b border-gray-100">
            <button 
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === 'all' ? 'text-[#9b1a31] font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#9b1a31]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === 'unread' ? 'text-[#9b1a31] font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#9b1a31]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center ml-1 sm:ml-2 min-w-[16px] sm:min-w-[20px] h-4 sm:h-5 px-1 sm:px-1.5 py-0.5 bg-[#9b1a31] text-white text-[10px] sm:text-xs font-medium rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10 bg-white">
              <div className="w-6 sm:w-8 h-6 sm:h-8 border-2 border-gray-200 border-t-[#9b1a31] rounded-full animate-spin mb-3"></div>
              <p className="text-xs sm:text-sm text-gray-600">Loading notifications...</p>
            </div>
          ) : (
            <div className="p-2 sm:p-4 overflow-y-auto max-h-[400px] sm:max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {Object.entries(notificationGroups).map(([group, groupNotifications]) => {
                if (groupNotifications.length === 0) return null;
                
                return (
                  <div key={group} className="mb-3 sm:mb-4">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 sm:px-4 py-1 sm:py-2">{group}</h3>
                    {groupNotifications.map((notification) => renderInPageNotificationItem(notification))}
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
    <div className="relative inline-block">
      <div className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white" onClick={toggleNotificationsPanel}>
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-[18px] h-[18px] bg-[#9b1a31] text-white text-xs font-bold rounded-full shadow">
            {unreadCount}
          </span>
        )}
      </div>

      {showNotifications && (
        <div className="absolute right-0 mt-2.5 w-[280px] sm:w-[320px] bg-white rounded-lg shadow-lg z-[1000] overflow-hidden animate-fadeIn origin-top-right">
          <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 bg-white border-b border-gray-100">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="px-2 py-1.5 flex items-center gap-1 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[#9b1a31] rounded transition-colors"
              >
                <FaCheckCircle className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex bg-white border-b border-gray-100">
            <button 
              className={`flex-1 py-2 px-2 text-xs font-medium transition-colors ${activeTab === 'all' ? 'text-[#9b1a31] font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#9b1a31]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`flex-1 py-2 px-2 text-xs font-medium transition-colors ${activeTab === 'unread' ? 'text-[#9b1a31] font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#9b1a31]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center ml-1 min-w-[16px] h-4 px-1 py-0.5 bg-[#9b1a31] text-white text-[10px] font-medium rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 bg-white">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#9b1a31] rounded-full animate-spin mb-2"></div>
              <p className="text-xs text-gray-600">Loading...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <>
              <div className="p-2 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredNotifications.map((notification) => renderNotificationItem(notification))}
              </div>
              <div className="py-2 px-4 border-t border-gray-100 text-center bg-white">
                <a href={user?.role === 'student' ? '/student/notifications' : '/faculty/Notifications'} className="text-xs font-medium text-[#9b1a31] hover:underline">
                  View all notifications
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center bg-white">
              <FaRegBell className="text-2xl text-gray-300 mb-2" />
              <p className="text-xs text-gray-500">No notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent; 