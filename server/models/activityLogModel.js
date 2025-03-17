import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ""
  },
  ipAddress: {
    type: String,
    default: ""
  },
  deviceInfo: {
    type: String,
    default: ""
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for faster queries
ActivityLogSchema.index({ userId: 1 });
ActivityLogSchema.index({ userType: 1 });
ActivityLogSchema.index({ timestamp: 1 });
ActivityLogSchema.index({ action: 1 });

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
export default ActivityLog; 