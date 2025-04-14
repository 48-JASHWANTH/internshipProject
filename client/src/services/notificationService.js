import { requestNotificationPermission, onMessageListener } from '../lib/firebase';
import axios from 'axios';
import { apiClient } from '../lib/api-client';

const API_URL = import.meta.env.VITE_API_URL;

export const registerForNotifications = async () => {
  try {
    console.log('Requesting notification permission from browser...');
    const token = await requestNotificationPermission();
    console.log('Notification permission result:', token ? 'Granted with token' : 'Denied or error');
    
    if (token) {
      console.log('Registering FCM token with server...');
      // Use apiClient which has withCredentials set to true
      const response = await apiClient.post('/api/notifications/register', {
        token
      }, { withCredentials: true });
      
      console.log('Token registration response:', response.data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error registering for notifications:', error);
    console.error('Error details:', error.response?.data || 'No response data');
    return false;
  }
};

export const setupNotificationListener = (callback) => {
  console.log('Setting up notification listener...');
  onMessageListener()
    .then((payload) => {
      console.log('Received notification payload:', payload);
      callback(payload);
    })
    .catch((err) => console.error('Error in notification listener:', err));
};

export const showNotification = (title, options) => {
  console.log('Showing browser notification:', title);
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}; 