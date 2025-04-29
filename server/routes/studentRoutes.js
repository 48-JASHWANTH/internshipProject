import { Router } from "express";
import { studentLogin } from "../controllers/authController.js";
import { verifyToken} from "../middleware/verifyToken.js";
import { 
  updateStudentAcademicData, 
  updateStudentAdditional,
  updateStudentPersonal, 
  getStudentDashBoardDetails, 
  getStudentActiveWorks, 
  getStudentArchive, 
  getCampusProjects, 
  getStudentData,
  updateProjectGithub,
  updateProjectDrive,
  updateProjectOverview,
  updateProjectTitle,
  updateTaskStatus,
  getTeamReviews,
  getTeamTasks,
  getStudentDashboardData,
  updateStudentSocial
} from "../controllers/studentController.js";
const studentRoutes = Router();

// Public routes
studentRoutes.post('/login', studentLogin);
//  optimise these routes
studentRoutes.put('/academic/:studentID', verifyToken , updateStudentAcademicData);
studentRoutes.put('/additional/:studentID',verifyToken ,  updateStudentAdditional);
studentRoutes.put('/personal/:studentID',verifyToken ,  updateStudentPersonal);
studentRoutes.put('/social/:studentID',verifyToken ,  updateStudentSocial);
// Combined route for getting student data
studentRoutes.get('/data/:studentID', verifyToken, getStudentData);

// Dashboard related routes
studentRoutes.get('/dashboard-data/:studentID', verifyToken, getStudentDashboardData);
studentRoutes.get('/dashboard/:studentID',verifyToken , getStudentDashBoardDetails)
studentRoutes.get('/activeWorks/:studentID',verifyToken , getStudentActiveWorks)
studentRoutes.get('/archive/:studentID',verifyToken , getStudentArchive)
studentRoutes.get('/campusProjects',verifyToken , getCampusProjects)

// New dedicated routes for reviews and tasks
studentRoutes.get('/team/:teamId/reviews', verifyToken, getTeamReviews);
studentRoutes.get('/team/:teamId/tasks', verifyToken, getTeamTasks);

// Project update routes
studentRoutes.put('/project/github/:teamId', verifyToken, updateProjectGithub);
studentRoutes.put('/project/drive/:teamId', verifyToken, updateProjectDrive);
studentRoutes.put('/project/overview/:teamId', verifyToken, updateProjectOverview);
studentRoutes.put('/project/title/:teamId', verifyToken, updateProjectTitle);
studentRoutes.put('/project/task/:teamId/:taskId', verifyToken, updateTaskStatus);

export default studentRoutes;