import { Router } from "express";
import { createTeams, getAllFaculty, getLeadedProjects, addTaskToTeam, addReviewToTeam, getTeamTasks, getTeamReviews, getGuidedProjects, getFacultyInfo, updateTaskStatus, completeClass, getFacultyById, updateFacultyData } from "../controllers/facultyController.js";
import { facultyLogin } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const facultyRoutes = Router();

// Public routes
facultyRoutes.post('/login', facultyLogin);

// Protected routes
facultyRoutes.post('/createTeams', verifyToken, createTeams);
facultyRoutes.get('/all', verifyToken, getAllFaculty);
facultyRoutes.get('/:facultyID/leaded-projects', verifyToken, getLeadedProjects);
facultyRoutes.post('/team/:teamId/task', verifyToken, addTaskToTeam);
facultyRoutes.put('/team/:teamId/task/:taskId', verifyToken, updateTaskStatus);
facultyRoutes.post('/team/:teamId/review', verifyToken, addReviewToTeam);
facultyRoutes.get('/team/:teamId/tasks', verifyToken, getTeamTasks);
facultyRoutes.get('/team/:teamId/reviews', verifyToken, getTeamReviews);
facultyRoutes.get('/:facultyID/guided-projects', verifyToken, getGuidedProjects);
facultyRoutes.get('/info/:facultyID', verifyToken, getFacultyInfo);
facultyRoutes.put('/complete-class/:classId', verifyToken, completeClass);
facultyRoutes.get('/:facultyId', verifyToken, getFacultyById);
facultyRoutes.put('/update/:facultyId', verifyToken, updateFacultyData);

export default facultyRoutes;