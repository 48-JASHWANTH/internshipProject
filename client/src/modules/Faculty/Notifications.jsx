import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Review Completed',
      message: 'You have successfully completed the review for Project "AI Chatbot" - Team 4.',
      timestamp: '2024-03-15T10:30:00Z',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pending Review',
      message: 'Project "Web Development Portal" is awaiting your review. Deadline: March 20, 2024',
      timestamp: '2024-03-14T15:45:00Z',
      isRead: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New Project Assigned',
      message: 'You have been assigned as a guide for Project "Machine Learning Model" - Team 2.',
      timestamp: '2024-03-13T09:15:00Z',
      isRead: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Feedback Acknowledged',
      message: 'Team 3 has acknowledged your feedback for their project review.',
      timestamp: '2024-03-12T14:20:00Z',
      isRead: true
    }
  ]);

  const getUnreadCount = () => notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 w-5 h-5" />;
      case 'warning':
        return <FaExclamationCircle className="text-orange-500 w-5 h-5" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500 w-5 h-5" />;
      default:
        return <FaBell className="text-gray-500 w-5 h-5" />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications {getUnreadCount() > 0 && `(${getUnreadCount()})`}
        </h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-[#9b1a31] hover:text-[#82001A]"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-4 flex items-start gap-3 transition-colors duration-200
              ${!notification.isRead ? 'bg-blue-50' : ''}`}
          >
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-800">
                  {notification.title}
                </p>
                <span className="text-xs text-gray-400">
                  {formatDate(notification.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`text-xs ${
                    notification.isRead 
                      ? 'text-gray-400 cursor-default' 
                      : 'text-[#9b1a31] hover:text-[#82001A]'
                  }`}
                  disabled={notification.isRead}
                >
                  {notification.isRead ? 'Read' : 'Mark as read'}
                </button>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaBell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 