import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Token expires after 24 hours (86400 seconds)
  }
});

// Compound index to ensure uniqueness of userId and userType combination
PasswordResetSchema.index({ userId: 1, userType: 1 }, { unique: true });

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);
export default PasswordReset; 