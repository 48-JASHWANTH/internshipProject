import admin from 'firebase-admin';
import NotificationToken from '../models/NotificationToken.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service account file
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccountJson = JSON.parse(
  await readFile(serviceAccountPath, 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson)
});

export const sendNotification = async (userIds, title, body) => {
  try {
    console.log('=========== NOTIFICATION SERVICE DEBUG ===========');
    console.log('Sending notification to userIds:', userIds);
    console.log('Notification title:', title);
    
    // Get all tokens for the users
    console.log('Querying for notification tokens...');
    const tokens = await NotificationToken.find({
      userId: { $in: userIds }
    }).select('token');

    console.log('Found tokens:', tokens);
    
    if (tokens.length === 0) {
      console.log('No notification tokens found for users. Notification will not be sent.');
      return;
    }

    const tokenStrings = tokens.map(token => token.token);
    console.log('Sending notification to tokens:', tokenStrings);
    
    const message = {
      notification: {
        title,
        body
      },
      data: {
        type: title.includes('Review') ? 'review' : 'general'
      },
      tokens: tokenStrings
    };

    console.log('Sending multicast message to Firebase...');
    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent notification. Success count:', response.successCount);
    console.log('Failed count:', response.failureCount);
    
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push({
            token: tokenStrings[idx],
            error: resp.error
          });
        }
      });
      console.log('Failed tokens:', failedTokens);
    }
    console.log('=========== END NOTIFICATION SERVICE DEBUG ===========');
  } catch (error) {
    console.error('Error sending notification:', error);
    console.error('Error stack:', error.stack);
  }
};

export const registerToken = async (userId, token) => {
  try {
    await NotificationToken.findOneAndUpdate(
      { token },
      { userId },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('Error registering token:', error);
    return false;
  }
}; 