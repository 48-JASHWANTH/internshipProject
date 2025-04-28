import { Router } from "express";
import { getAllProjects, getProjectById } from "../controllers/commonController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const commonRoutes = Router();

// Route to get all projects (basic details)
commonRoutes.get('/projects', getAllProjects);

// Route to get a specific project by ID
commonRoutes.get('/projects/:projectId', getProjectById);

export default commonRoutes; 