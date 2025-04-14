import express from 'express';
import { registerToken } from '../services/notificationService.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { 
  createNotification, 
  getUserNotifications, 
  markNotificationAsRead,
  createProjectNotification,
  createTaskNotification,
  createReviewNotification,
  createForumProjectNotification,
  createTaskCompletionNotification,
  createTestNotificationForFaculty
} from '../controllers/notificationController.js';

const router = express.Router();

// Register notification token
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { token } = req.body;
    console.log('Token registration request:', { user: req.user, token });
    
    // Get the appropriate ID based on user role
    const userId = req.user.role === 'student' 
      ? req.user.studentID 
      : req.user.facultyID;
    
    console.log('Using userId for notification token:', userId);
    
    const success = await registerToken(userId, token);
    
    if (success) {
      res.status(200).json({ message: 'Token registered successfully' });
    } else {
      res.status(500).json({ message: 'Failed to register token' });
    }
  } catch (error) {
    console.error('Error registering notification token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new notification
router.post('/create', verifyToken, createNotification);

// Get notifications for a specific user
router.get('/user/:userType/:userId', verifyToken, getUserNotifications);

// Mark notification as read
router.put('/:notificationId/read', verifyToken, markNotificationAsRead);

// Create notifications for a new project
router.post('/project', verifyToken, createProjectNotification);

// Create notifications for a new task
router.post('/task', verifyToken, createTaskNotification);

// Create notifications for a new review
router.post('/review', verifyToken, createReviewNotification);

// Create notifications for a new forum project
router.post('/forum-project', verifyToken, (req, res) => {
  // Forward to the appropriate controller
  createForumProjectNotification(req, res);
});

// Create notifications for task completion (student to faculty)
router.post('/task-completion', verifyToken, (req, res) => {
  // Forward to the appropriate controller
  createTaskCompletionNotification(req, res);
});

// Test route for creating a direct notification to faculty (for debugging)
router.post('/test-faculty', verifyToken, createTestNotificationForFaculty);

export default router; 