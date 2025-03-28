import { Router } from "express";
import { createTeams, getAllFaculty, getLeadedProjects, addTaskToTeam, addReviewToTeam, getTeamTasks, getTeamReviews, getGuidedProjects, getFacultyInfo } from "../controllers/facultyController.js";
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
facultyRoutes.post('/team/:teamId/review', verifyToken, addReviewToTeam);
facultyRoutes.get('/team/:teamId/tasks', verifyToken, getTeamTasks);
facultyRoutes.get('/team/:teamId/reviews', verifyToken, getTeamReviews);
facultyRoutes.get('/:facultyID/guided-projects', verifyToken, getGuidedProjects);
facultyRoutes.get('/info/:facultyID', verifyToken, getFacultyInfo);

export default facultyRoutes;