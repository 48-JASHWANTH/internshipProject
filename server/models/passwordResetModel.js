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
    expires: 900 // Token expires after 15 minutes (900 seconds)
  }
});

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);
export default PasswordReset; 