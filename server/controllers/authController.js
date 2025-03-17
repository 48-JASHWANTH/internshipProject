import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Faculty from '../models/facultyModel.js';
import Student from '../models/studentModel.js';
import Admin from '../models/adminModel.js';
import ActivityLog from '../models/activityLogModel.js';
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
            // Log failed login attempt
            await new ActivityLog({
                userId: facultyID,
                userType: "faculty",
                action: "Failed Login",
                details: "Faculty not found",
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                deviceInfo: req.headers['user-agent'] || ''
            }).save();
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials ID"
            });
        }

        const isMatch = await bcrypt.compare(password, faculty.password);
        
        if (!isMatch) {
            // Log failed login attempt
            await new ActivityLog({
                userId: facultyID,
                userType: "faculty",
                action: "Failed Login",
                details: "Invalid password",
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                deviceInfo: req.headers['user-agent'] || ''
            }).save();
            
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

        // Log successful login
        await new ActivityLog({
            userId: facultyID,
            userType: "faculty",
            action: "Login",
            details: "Faculty logged in successfully",
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            deviceInfo: req.headers['user-agent'] || ''
        }).save();

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
            // Log failed login attempt
            await new ActivityLog({
                userId: studentID,
                userType: "student",
                action: "Failed Login",
                details: "Student not found",
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                deviceInfo: req.headers['user-agent'] || ''
            }).save();
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials ID"
            });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        
        if (!isMatch) {
            // Log failed login attempt
            await new ActivityLog({
                userId: studentID,
                userType: "student",
                action: "Failed Login",
                details: "Invalid password",
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                deviceInfo: req.headers['user-agent'] || ''
            }).save();
            
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

        // Log successful login
        await new ActivityLog({
            userId: studentID,
            userType: "student",
            action: "Login",
            details: "Student logged in successfully",
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            deviceInfo: req.headers['user-agent'] || ''
        }).save();

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

// Admin login
export const adminLogin = async (req, res) => {
    try {
        const { adminID, password } = req.body;

        // Find admin by ID
        const admin = await Admin.findOne({ adminID });

        if (!admin) {
            // Log failed login attempt
            await new ActivityLog({
                userId: adminID,
                userType: "admin",
                action: "Failed Login",
                details: "Admin not found",
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                deviceInfo: req.headers['user-agent'] || ''
            }).save();
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            // Log failed login attempt
            await new ActivityLog({
                userId: adminID,
                userType: "admin",
                action: "Failed Login",
                details: "Invalid password",
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                deviceInfo: req.headers['user-agent'] || ''
            }).save();
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Log successful login
        await new ActivityLog({
            userId: adminID,
            userType: "admin",
            action: "Login",
            details: "Admin logged in successfully",
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            deviceInfo: req.headers['user-agent'] || ''
        }).save();

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                adminID: admin.adminID,
                name: admin.name,
                email: admin.email,
                role: "admin"
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during login",
            error: error.message
        });
    }
}; 