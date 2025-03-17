import { Router } from "express";
import { createTeams } from "../controllers/facultyController.js";
import { facultyLogin } from "../controllers/authController.js";
import { verifyToken, verifyFaculty } from "../middleware/verifyToken.js";

const facultyRoutes = Router();

// Public routes
facultyRoutes.post('/login', facultyLogin);

// Protected routes
facultyRoutes.post('/createTeams', createTeams);

export default facultyRoutes;