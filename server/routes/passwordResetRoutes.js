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

// Verify reset token
passwordResetRoutes.get('/verify-token', verifyResetToken);

// Direct password reset (for testing/admin purposes only)
passwordResetRoutes.post('/direct-reset', directPasswordReset);

export default passwordResetRoutes; 