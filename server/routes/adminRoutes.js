import { Router } from "express";
import { 
  addStudents, 
  softDeleteStudent, 
  restoreStudent, 
  updateStudent,
  listAllStudents,
  getStudentDetails,
  getInactiveStudents,
  getDashboardStats,
  bulkUpdateStudents
} from "../controllers/adminController.js";

import {
  addFaculty,
  listAllFaculty,
  getFacultyDetails,
  updateFaculty,
  softDeleteFaculty,
  restoreFaculty,
  listDeletedFaculty,
  bulkUpdateFaculty
} from "../controllers/adminFacultyController.js";

import { adminLogin } from "../controllers/authController.js";
import { verifyToken} from "../middleware/verifyToken.js";

const adminRoutes = Router();
const protectedRoutes = Router();

// Public routes
adminRoutes.post('/login', adminLogin);

// Protected routes - all require admin authentication
adminRoutes.use(verifyToken);
adminRoutes.use(protectedRoutes);

// Student management routes
protectedRoutes.post('/add-students', addStudents);
protectedRoutes.post('/bulk-update-students', bulkUpdateStudents);
protectedRoutes.get('/students/deleted', getInactiveStudents);
protectedRoutes.get('/students', listAllStudents);
protectedRoutes.get('/students/:studentID', getStudentDetails);
protectedRoutes.put('/students/:studentID', updateStudent);
protectedRoutes.delete('/students/:studentID', softDeleteStudent);
protectedRoutes.post('/students/:studentID/restore', restoreStudent);

// Faculty management routes
protectedRoutes.post('/add-faculty', addFaculty);
protectedRoutes.post('/bulk-update-faculty', bulkUpdateFaculty);
protectedRoutes.get('/faculty', listAllFaculty);
protectedRoutes.get('/faculty/deleted', listDeletedFaculty);
protectedRoutes.get('/faculty/:facultyID', getFacultyDetails);
protectedRoutes.put('/faculty/:facultyID', updateFaculty);
protectedRoutes.delete('/faculty/:facultyID', softDeleteFaculty);
protectedRoutes.post('/faculty/:facultyID/restore', restoreFaculty);

// New route for dashboard stats
protectedRoutes.get('/dashboard-stats', getDashboardStats);

export default adminRoutes;
