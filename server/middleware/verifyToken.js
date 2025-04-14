import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verify JWT token middleware
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // Check if this is a notification endpoint - special handling for these routes
        const isNotificationEndpoint = req.originalUrl.includes('/api/notifications');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No authentication token provided" 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (tokenError) {
            // For notification endpoints, we'll allow continuing with limited functionality
            // This prevents users from being logged out when receiving notifications
            if (isNotificationEndpoint) {
                console.log('Token validation issue for notification endpoint, allowing limited access');
                // Try to extract basic info from token without verification
                try {
                    const decodedWithoutVerification = jwt.decode(token);
                    req.user = decodedWithoutVerification || { role: 'unknown' };
                    next();
                } catch (decodeError) {
                    console.error('Error decoding token:', decodeError);
                    req.user = { role: 'unknown' };
                    next();
                }
            } else {
                // For non-notification endpoints, enforce strict token validation
                return res.status(401).json({ 
                    success: false, 
                    message: "Invalid or expired token" 
                });
            }
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ 
            success: false, 
            message: "Authentication error" 
        });
    }
};
