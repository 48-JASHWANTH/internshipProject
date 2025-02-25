import { Router } from "express";
import { studentLogin } from "../controllers/authController.js";
import { verifyToken, verifyStudent } from "../middleware/verifyToken.js";

const studentRoutes = Router();

// Public routes
studentRoutes.post('/login', studentLogin);

// Protected routes (add your protected routes here)
// studentRoutes.get('/profile', verifyToken, verifyStudent, getProfile);

export default studentRoutes;
