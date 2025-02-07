import { Router } from "express";
import { createTeams } from "../controllers/facultyController.js";
const facultyRoutes = Router();


facultyRoutes.post('/createTeams',createTeams)
export default facultyRoutes
// inchargeRoutes.
