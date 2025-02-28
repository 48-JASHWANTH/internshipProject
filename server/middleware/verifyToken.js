import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verify JWT token middleware
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No authentication token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
};

// Role-based middleware functions
export const verifyStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Students only."
        });
    }
    next();
};

export const verifyFaculty = (req, res, next) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Faculty only."
        });
    }
    next();
};

export const verifyAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Admin verification failed'
        });
    }
};

// Optional: Verify specific permissions
export const verifyPermissions = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to access this resource"
            });
        }
        next();
    };
};
