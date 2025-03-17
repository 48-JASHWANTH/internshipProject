import { Router } from "express";
import { 
  logActivity,
  getUserActivity,
  getCurrentlyOnline,
  getSuspiciousActivities,
  getUserStatistics
} from "../controllers/activityLogController.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const activityLogRoutes = Router();

// Public route for logging activity (can be called from client)
activityLogRoutes.post('/log-activity', logActivity);

// Admin-only routes
activityLogRoutes.get('/user-activity', verifyToken, verifyAdmin, getUserActivity);
activityLogRoutes.get('/currently-online', verifyToken, verifyAdmin, getCurrentlyOnline);
activityLogRoutes.get('/suspicious-activities', verifyToken, verifyAdmin, getSuspiciousActivities);
activityLogRoutes.get('/user-statistics', verifyToken, verifyAdmin, getUserStatistics);

export default activityLogRoutes; 