import React from 'react';
import NotificationComponent from '../Notification/NotificationComponent';

const StudentNotifications = () => {
  return (
    <div className="w-full h-full p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
      <div className="notification-fullpage-wrapper">
        <NotificationComponent inPage={true} />
      </div>
    </div>
  );
};

export default StudentNotifications; 