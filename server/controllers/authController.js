import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Faculty from '../models/facultyModel.js';
import Student from '../models/studentModel.js';
import Admin from '../models/adminModel.js';
import ActivityLog from '../models/activityLogModel.js';
import LoginAttempt from '../models/loginAttemptModel.js';
import asyncHandler from 'express-async-handler';

const maxAge = 2*60*60*1000
// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            role: user.role,
            email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: maxAge }
    );
};

// Check if account is locked
const checkAccountLock = async (userId, userType, req) => {
    const loginAttempt = await LoginAttempt.findOne({ userId, userType });
    
    if (!loginAttempt) {
        return { isLocked: false };
    }
    
    // If account is locked, check if lock period has expired
    if (loginAttempt.isLocked) {
        const now = new Date();
        if (loginAttempt.lockedUntil && now < loginAttempt.lockedUntil) {
            // Account is still locked
            const remainingTime = Math.ceil((loginAttempt.lockedUntil - now) / (1000 * 60)); // in minutes
            return { 
                isLocked: true, 
                message: `Account is locked. Try again after ${remainingTime} minutes.` 
            };
        } else {
            // Lock period expired, reset the attempts
            loginAttempt.isLocked = false;
            loginAttempt.attempts = 0;
            loginAttempt.lockedUntil = null;
            await loginAttempt.save();
            return { isLocked: false };
        }
    }
    
    return { isLocked: false };
};

// Record failed login attempt
const recordFailedAttempt = async (userId, userType, req) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let loginAttempt = await LoginAttempt.findOne({ userId, userType });
    
    if (!loginAttempt) {
        loginAttempt = new LoginAttempt({
            userId,
            userType,
            attempts: 1,
            ipAddress,
            lastAttempt: new Date()
        });
    } else {
        loginAttempt.attempts += 1;
        loginAttempt.lastAttempt = new Date();
        loginAttempt.ipAddress = ipAddress;
        
        // Lock the account after 5 failed attempts
        if (loginAttempt.attempts >= 5) {
            const lockUntil = new Date();
            lockUntil.setMinutes(lockUntil.getMinutes() + 30); // Lock for 30 minutes
            
            loginAttempt.isLocked = true;
            loginAttempt.lockedUntil = lockUntil;
        }
    }
    
    await loginAttempt.save();
    return loginAttempt;
};

// Reset login attempts on successful login
const resetLoginAttempts = async (userId, userType) => {
    const loginAttempt = await LoginAttempt.findOne({ userId, userType });
    
    if (loginAttempt) {
        loginAttempt.attempts = 0;
        loginAttempt.isLocked = false;
        loginAttempt.lockedUntil = null;
        await loginAttempt.save();
    }
};

// Faculty Login
export const facultyLogin = asyncHandler(async (req, res) => {
    const { facultyID, password } = req.body;

    try {
        // Check if account is locked
        const lockStatus = await checkAccountLock(facultyID, 'faculty', req);
        if (lockStatus.isLocked) {
            return res.status(403).json({
                success: false,
                message: lockStatus.message
            });
        }
        
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
            
            // Record failed attempt
            const attempt = await recordFailedAttempt(facultyID, 'faculty', req);
            const attemptsRemaining = 5 - attempt.attempts;
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials ID",
                attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
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
            
            // Record failed attempt
            const attempt = await recordFailedAttempt(facultyID, 'faculty', req);
            
            // If account just got locked
            if (attempt.isLocked) {
                return res.status(403).json({
                    success: false,
                    message: "Your account has been locked due to multiple failed login attempts. Try again after 30 minutes."
                });
            }
            
            const attemptsRemaining = 5 - attempt.attempts;
            return res.status(401).json({
                success: false,
                message: "Invalid credentials pass",
                attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
            });
        }

        // Reset login attempts on successful login
        await resetLoginAttempts(facultyID, 'faculty');

        res.cookie("jwt", generateToken({
            _id: faculty._id,
            role: 'faculty',
            email: faculty.email
        }),{
            maxAge,secure:true,sameSite:"None"
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
        // Check if account is locked
        const lockStatus = await checkAccountLock(studentID, 'student', req);
        if (lockStatus.isLocked) {
            return res.status(403).json({
                success: false,
                message: lockStatus.message
            });
        }
        
        const student = await Student.findOne({ studentID });
        
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
            
            // Record failed attempt
            const attempt = await recordFailedAttempt(studentID, 'student', req);
            const attemptsRemaining = 5 - attempt.attempts;
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials ID",
                attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
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
            
            // Record failed attempt
            const attempt = await recordFailedAttempt(studentID, 'student', req);
            
            // If account just got locked
            if (attempt.isLocked) {
                return res.status(403).json({
                    success: false,
                    message: "Your account has been locked due to multiple failed login attempts. Try again after 30 minutes."
                });
            }
            
            const attemptsRemaining = 5 - attempt.attempts;
            return res.status(401).json({
                success: false,
                message: "Invalid credentials pass",
                attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
            });
        }

        // Reset login attempts on successful login
        await resetLoginAttempts(studentID, 'student');

        res.cookie("jwt", generateToken({
            _id: student._id,
            role: 'student',
            email: student.mail
        }),{
            maxAge,secure:true,sameSite:"None"
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
            user: {
                studentID: student.studentID,
                email: student.mail,
                role: 'student'
            }
        });

    } catch (error) {
        console.log(error)
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

        // Check if account is locked
        const lockStatus = await checkAccountLock(adminID, 'admin', req);
        if (lockStatus.isLocked) {
            return res.status(403).json({
                success: false,
                message: lockStatus.message
            });
        }

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
            
            // Record failed attempt
            const attempt = await recordFailedAttempt(adminID, 'admin', req);
            const attemptsRemaining = 5 - attempt.attempts;
            
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
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
            
            // Record failed attempt
            const attempt = await recordFailedAttempt(adminID, 'admin', req);
            
            // If account just got locked
            if (attempt.isLocked) {
                return res.status(403).json({
                    success: false,
                    message: "Your account has been locked due to multiple failed login attempts. Try again after 30 minutes."
                });
            }
            
            const attemptsRemaining = 5 - attempt.attempts;
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
            });
        }

        // Reset login attempts on successful login
        await resetLoginAttempts(adminID, 'admin');

        res.cookie("jwt", generateToken({
            _id: admin._id,
            role: 'admin',
        }),{
            maxAge,secure:true,sameSite:"None"
        });

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