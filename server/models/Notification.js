import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['project', 'activity', 'forum', 'review', 'general'],
    default: 'general'
  },
  recipients: [{
    type: String,
    required: true
  }],
  recipientModel: {
    type: String,
    enum: ['Faculty', 'Student'],
    required: true
  },
  isRead: {
    type: Map,
    of: Boolean,
    default: {}
  },
  relatedProject: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
notificationSchema.index({ recipients: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema); 