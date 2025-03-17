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
    default: function() {
      return this.studentID ? `${this.studentID.toLowerCase()}@vnrvjiet.in` : '';
    },
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  notifications: {
    type: [String],
    default: []
  },
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Project',
    default: []
  },
  linkedInURL: {
    type: String,
    default: ''
  },
  githubURL: {
    type: String,
    default: ''
  },
  // New fields
  phone: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  dob: {
    type: Date,
    default: null
  },
  batch: {
    type: String,
    default: ''
  },
  dept: {
    type: String,
    default: ''
  },
  degree: {
    type: String,
    default: ''
  },
  '10thper': {
    type: Number,
    default: null
  },
  '12thper': {
    type: Number,
    default: null
  },
  cgpa: {
    type: Number,
    default: null
  },
  skills: {
    type: [String],
    default: []
  },
  languagesKnown: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// Add a method to the schema to filter out inactive users by default
StudentSchema.pre('find', function() {
  this.where({ isActive: true });
});

StudentSchema.pre('findOne', function() {
  this.where({ isActive: true });
});

const Student = mongoose.model("studentsCollection", StudentSchema);
export default Student
