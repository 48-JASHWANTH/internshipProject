import { Router } from "express";
import { studentLogin } from "../controllers/authController.js";
import { verifyToken} from "../middleware/verifyToken.js";
import { updateStudentAcademicData, updateStudentAdditional,updateStudentPersonal, getStudentDashBoardDetails, getStudentActiveWorks, getStudentArchive, getCampusProjects, getStudentData } from "../controllers/studentController.js";
const studentRoutes = Router();

// Public routes
studentRoutes.post('/login', studentLogin);
//  optimise these routes
studentRoutes.put('/academic/:studentID', verifyToken , updateStudentAcademicData);
studentRoutes.put('/additional/:studentID',verifyToken ,  updateStudentAdditional);
studentRoutes.put('/personal/:studentID',verifyToken ,  updateStudentPersonal);
// Combined route for getting student data
studentRoutes.get('/data/:studentID', verifyToken, getStudentData);

// Dashboard related routes
studentRoutes.get('/dashboard/:studentID',verifyToken , getStudentDashBoardDetails)
studentRoutes.get('/activeWorks/:studentID',verifyToken , getStudentActiveWorks)
studentRoutes.get('/archive/:studentID',verifyToken , getStudentArchive)
studentRoutes.get('/campusProjects',verifyToken , getCampusProjects)
export default studentRoutes;