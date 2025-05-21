import mongoose from 'mongoose';

const LoginAttemptSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  attempts: {
    type: Number,
    default: 1
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedUntil: {
    type: Date,
    default: null
  },
  lastAttempt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const LoginAttempt = mongoose.model('LoginAttempt', LoginAttemptSchema);
export default LoginAttempt; 