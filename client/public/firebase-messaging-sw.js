importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your Firebase configuration with hardcoded values
// In production, consider using a build step to inject these values
firebase.initializeApp({
  apiKey: "AIzaSyDfjgL0dKmP_Fmt0VVeaL2Z5UrbHHfTS7c",
  authDomain: "internship-project-1658c.firebaseapp.com",
  projectId: "internship-project-1658c",
  storageBucket: "internship-project-1658c.firebasestorage.app",
  messagingSenderId: "562509833435",
  appId: "1:562509833435:web:0b7e69bdc5b5c17e0058fe",
  vapidKey: "BILMb3p12c9GAKth8V_-ii0h2fVEaejCT2rjdiWzgVyK6AVIuVBT0TJC6k06lOGqNIIDbsUcnk-cXjW_9Z5pJ_k"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 