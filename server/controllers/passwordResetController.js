import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Student from "../models/studentModel.js";
import Faculty from "../models/facultyModel.js";
import Admin from "../models/adminModel.js";
import PasswordReset from "../models/passwordResetModel.js";
import ActivityLog from "../models/activityLogModel.js";
import dotenv from "dotenv";

dotenv.config();

// Create a nodemailer transporter using Ethereal (for development/testing)
let testAccount;
let transporter;

const createTransporter = async () => {
  // Create a test account if one doesn't exist
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }
  
  // Create a transporter
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Find user by email across all user types
const findUserByEmail = async (email) => {
  // Check in student collection
  let user = await Student.findOne({ mail: email });
  if (user) return { user, userType: "student", idField: "studentID" };

  // Check in faculty collection
  user = await Faculty.findOne({ email });
  if (user) return { user, userType: "faculty", idField: "facultyID" };

  // Check in admin collection
  user = await Admin.findOne({ email });
  if (user) return { user, userType: "admin", idField: "adminID" };

  return null;
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user by email and specified user type
    let userInfo;
    
    if (userType === 'student') {
      const user = await Student.findOne({ mail: email });
      if (user) userInfo = { user, userType: "student", idField: "studentID" };
    } else if (userType === 'faculty') {
      const user = await Faculty.findOne({ email });
      if (user) userInfo = { user, userType: "faculty", idField: "facultyID" };
    } else if (userType === 'admin') {
      const user = await Admin.findOne({ email });
      if (user) userInfo = { user, userType: "admin", idField: "adminID" };
    }

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: `User with this email does not exist as ${userType}`
      });
    }

    const { user, idField } = userInfo;
    const userId = user[idField];

    // Generate a token using JWT
    const token = jwt.sign(
      { userId, userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Save the token in the database
    await PasswordReset.findOneAndDelete({ userId, userType }); // Remove any existing tokens
    await PasswordReset.create({
      userId,
      userType,
      token
    });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}&userType=${userType}`;

    // Configure Gmail transporter with OAuth2
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    const mailOptions = {
      from: `"Password Reset" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4a5568; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email"
    });

    // Log the activity
    await new ActivityLog({
      userId,
      userType,
      action: "Password Reset Request",
      details: "Password reset link sent to email",
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      deviceInfo: req.headers['user-agent'] || ''
    }).save();
  } catch (error) {
    console.error("Error in password reset request:", error);
    res.status(500).json({
      success: false,
      message: "Error requesting password reset",
      error: error.message
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, userType, password } = req.body;

    if (!token || !userType || !password) {
      return res.status(400).json({
        success: false,
        message: "Token, user type, and password are required"
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Find the reset token in database
    const resetRequest = await PasswordReset.findOne({
      token,
      userType
    });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    let user;
    switch (userType) {
      case "student":
        user = await Student.findOneAndUpdate(
          { studentID: resetRequest.userId },
          { password: hashedPassword }
        );
        break;
      case "faculty":
        user = await Faculty.findOneAndUpdate(
          { facultyID: resetRequest.userId },
          { password: hashedPassword }
        );
        break;
      case "admin":
        user = await Admin.findOneAndUpdate(
          { adminID: resetRequest.userId },
          { password: hashedPassword }
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user type"
        });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete the reset token
    await PasswordReset.deleteOne({ _id: resetRequest._id });

    // Log the activity
    await new ActivityLog({
      userId: resetRequest.userId,
      userType,
      action: "Password Reset",
      details: "Password has been reset successfully",
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      deviceInfo: req.headers['user-agent'] || ''
    }).save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message
    });
  }
};

// Verify reset token
export const verifyResetToken = async (req, res) => {
  try {
    const { token, userType } = req.query;

    if (!token || !userType) {
      return res.status(400).json({
        success: false,
        message: "Token and user type are required"
      });
    }

    // Verify JWT token
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Find the reset token in database
    const resetRequest = await PasswordReset.findOne({
      token,
      userType
    });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      userId: resetRequest.userId,
      userType: resetRequest.userType
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying token",
      error: error.message
    });
  }
};

// Direct password reset (for testing purposes)
export const directPasswordReset = async (req, res) => {
  try {
    const { userId, userType, newPassword } = req.body;

    if (!userId || !userType || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "User ID, user type, and new password are required"
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password based on user type
    let user;
    switch (userType) {
      case "student":
        user = await Student.findOneAndUpdate(
          { studentID: userId },
          { password: hashedPassword },
          { new: true }
        );
        break;
      case "faculty":
        user = await Faculty.findOneAndUpdate(
          { facultyID: userId },
          { password: hashedPassword },
          { new: true }
        );
        break;
      case "admin":
        user = await Admin.findOneAndUpdate(
          { adminID: userId },
          { password: hashedPassword },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user type"
        });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Log the activity
    await new ActivityLog({
      userId,
      userType,
      action: "Direct Password Reset",
      details: "Password has been reset directly",
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      deviceInfo: req.headers['user-agent'] || ''
    }).save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Error in direct password reset:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message
    });
  }
}; 