import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

const StudentNotifications = () => {
  // Mock notifications data - in a real app, this would come from an API
  const [notifications] = useState([
    {
      id: 1,
      type: 'review',
      title: 'New Review Assigned',
      message: 'Your project "AI Chat Bot" has been assigned for review.',
      timestamp: '2 hours ago',
      status: 'unread',
      icon: <FaBell className="text-blue-500" />,
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Submission Deadline',
      message: 'Project submission deadline for "Web Development" is tomorrow.',
      timestamp: '5 hours ago',
      status: 'unread',
      icon: <FaClock className="text-yellow-500" />,
    },
    {
      id: 3,
      type: 'approval',
      title: 'Project Approved',
      message: 'Your project "Machine Learning Model" has been approved.',
      timestamp: '1 day ago',
      status: 'read',
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 4,
      type: 'warning',
      title: 'Review Required',
      message: 'Please review and update your project documentation.',
      timestamp: '2 days ago',
      status: 'read',
      icon: <FaExclamationCircle className="text-red-500" />,
    },
  ]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {notifications.filter(n => n.status === 'unread').length} unread
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                notification.status === 'unread' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {notification.icon}
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${
                    notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No notifications to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications; 