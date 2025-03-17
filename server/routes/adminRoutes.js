import { Router } from "express";
import { 
  addStudents, 
  softDeleteStudent, 
  restoreStudent, 
  listDeletedStudents,
  updateStudent,
  listAllStudents,
  getStudentDetails
} from "../controllers/adminController.js";

import {
  addFaculty,
  listAllFaculty,
  getFacultyDetails,
  updateFaculty,
  softDeleteFaculty,
  restoreFaculty,
  listDeletedFaculty
} from "../controllers/adminFacultyController.js";

import { adminLogin } from "../controllers/authController.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const adminRoutes = Router();

// Public routes
adminRoutes.post('/login', adminLogin);

// Protected routes - all require admin authentication
const protectedRoutes = Router();
protectedRoutes.use(verifyToken, verifyAdmin);

// Student management routes
protectedRoutes.post('/add-students', addStudents);
protectedRoutes.get('/students', listAllStudents);
protectedRoutes.get('/students/:studentID', getStudentDetails);
protectedRoutes.put('/students/:studentID', updateStudent);
protectedRoutes.delete('/students/:studentID', softDeleteStudent);
protectedRoutes.post('/students/:studentID/restore', restoreStudent);
protectedRoutes.get('/students/deleted', listDeletedStudents);

// Faculty management routes
protectedRoutes.post('/add-faculty', addFaculty);
protectedRoutes.get('/faculty', listAllFaculty);
protectedRoutes.get('/faculty/deleted', listDeletedFaculty);
protectedRoutes.get('/faculty/:facultyID', getFacultyDetails);
protectedRoutes.put('/faculty/:facultyID', updateFaculty);
protectedRoutes.delete('/faculty/:facultyID', softDeleteFaculty);
protectedRoutes.post('/faculty/:facultyID/restore', restoreFaculty);

// Add the protected routes to the admin router
adminRoutes.use('/', protectedRoutes);

export default adminRoutes;
