import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Add this to load environment variables

const StudentSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: process.env.DEFAULT_PASSWORD // This should work now
  },
  mail: {
    type: String,
    default: ''
  },
  notifications: {
    type: [String],
    default: []
  },
  projects: {
    type: Number,
    default: 0
  },
  linkedInURL: {
    type: String,
    default: ''
  },
  githubURL: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Student = mongoose.model("studentsCollection", StudentSchema);
export default Student
