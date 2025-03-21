import { Router } from "express";
import { 
  logActivity,
  getUserActivity,
  getCurrentlyOnline,
  getSuspiciousActivities,
  getUserStatistics
} from "../controllers/activityLogController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const activityLogRoutes = Router();

// Public route for logging activity (can be called from client)
activityLogRoutes.post('/log-activity', logActivity);

// Admin-only routes
activityLogRoutes.get('/user-activity', verifyToken, getUserActivity);
activityLogRoutes.get('/currently-online', verifyToken, getCurrentlyOnline);
activityLogRoutes.get('/suspicious-activities', verifyToken, getSuspiciousActivities);
activityLogRoutes.get('/user-statistics', verifyToken, getUserStatistics);

export default activityLogRoutes; 