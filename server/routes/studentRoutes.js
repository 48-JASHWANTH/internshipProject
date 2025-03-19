import { Router } from "express";
import { studentLogin } from "../controllers/authController.js";
import { verifyToken, verifyStudent } from "../middleware/verifyToken.js";
import { updateStudentAcademicData, getStudentAcademic, updateStudentAdditional, getStudentAdditional,updateStudentPersonal,getStudentPersonal, getStudentDashBoardDetails, getStudentActiveWorks, getStudentArchive, getCampusProjects} from "../controllers/studentController.js";
const studentRoutes = Router();

// Public routes
studentRoutes.post('/login', studentLogin);
//  optimise these routes
studentRoutes.put('/academic/:studentID', updateStudentAcademicData);
studentRoutes.get('/academic/:studentID', getStudentAcademic);
studentRoutes.put('/additional/:studentID', updateStudentAdditional);
studentRoutes.get('/additional/:studentID', getStudentAdditional);
studentRoutes.put('/personal/:studentID', updateStudentPersonal);
studentRoutes.get('/personal/:studentID', getStudentPersonal);


studentRoutes.get('/dashboard/:studentID',getStudentDashBoardDetails)
studentRoutes.get('/activeWorks/:studentID',getStudentActiveWorks)
studentRoutes.get('/archive/:studentID',getStudentArchive)
studentRoutes.get('/campusProjects',getCampusProjects)
export default studentRoutes;