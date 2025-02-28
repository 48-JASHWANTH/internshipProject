import { Router } from "express";
import { addStudents } from "../controllers/adminController.js";

const adminRoutes = Router();

// Removed authentication middleware temporarily
adminRoutes.post('/add-students', addStudents);

export default adminRoutes;
