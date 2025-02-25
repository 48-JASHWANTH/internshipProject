import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Faculty from '../models/FacultyModel.js';
import Student from '../models/studentModel.js';
import asyncHandler from 'express-async-handler';

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            role: user.role,
            email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Faculty Login
export const facultyLogin = asyncHandler(async (req, res) => {
    const { facultyID, password } = req.body;

    try {
        const faculty = await Faculty.findOne({ facultyID });
        
        if (!faculty) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials ID"
            });
        }

        const isMatch = await bcrypt.compare(password, faculty.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials pass"
            });
        }

        const token = generateToken({
            _id: faculty._id,
            role: 'faculty',
            email: faculty.email
        });

        res.json({
            success: true,
            token,
            user: {
                facultyID: faculty.facultyID,
                email: faculty.email,
                role: 'faculty'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
});

// Student Login
export const studentLogin = asyncHandler(async (req, res) => {
    const { studentID, password } = req.body;

    try {
        const student = await Student.findOne({ studentID });
        console.log(student);
        
        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials ID"
            });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials pass"
            });
        }

        const token = generateToken({
            _id: student._id,
            role: 'student',
            email: student.mail
        });

        res.json({
            success: true,
            token,
            user: {
                studentID: student.studentID,
                email: student.mail,
                role: 'student'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
}); 