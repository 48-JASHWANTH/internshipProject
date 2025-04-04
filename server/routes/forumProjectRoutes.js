import { Router } from 'express';
import { 
  createProject, 
  getAllProjects, 
  getFacultyProjects, 
  updateProjectStatus, 
  expressInterest,
  getProjectDetails
} from '../controllers/forumProjectController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const forumProjectRoutes = Router();

// Create a new project
forumProjectRoutes.post('/create-forum-projects', verifyToken, createProject);

// Get all projects
forumProjectRoutes.get('/get-all-forumProjects', verifyToken, getAllProjects);

// Get projects by faculty ID
forumProjectRoutes.get('/:facultyId', verifyToken, getFacultyProjects);

// Update project status
forumProjectRoutes.put('/:projectId/status', verifyToken, updateProjectStatus);

// Express interest in a project
forumProjectRoutes.post('/:projectId/express-interest', verifyToken, expressInterest);

// Get project details by projectId
forumProjectRoutes.get('/project/:projectId', verifyToken, getProjectDetails);

export default forumProjectRoutes; 