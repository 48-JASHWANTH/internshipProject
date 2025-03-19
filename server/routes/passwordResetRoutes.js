import { Router } from "express";
import { 
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
  directPasswordReset
} from "../controllers/passwordResetController.js";

const passwordResetRoutes = Router();

// Request password reset
passwordResetRoutes.post('/request-reset', requestPasswordReset);

// Reset password with token
passwordResetRoutes.post('/reset-password', resetPassword);

// Direct password reset (for testing)
passwordResetRoutes.post('/direct-reset', directPasswordReset);

// Verify reset token (optional)
passwordResetRoutes.get('/verify-token', verifyResetToken);

export default passwordResetRoutes; 