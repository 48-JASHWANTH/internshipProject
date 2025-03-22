import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verify JWT token middleware
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        // console.log(token);
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No authentication token provided" 
            });
        }

        if (!jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(403).json({
                success: false,
                message: "Invalid token"
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
