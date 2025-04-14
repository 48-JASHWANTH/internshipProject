import mongoose from 'mongoose';

const notificationTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('NotificationToken', notificationTokenSchema); 