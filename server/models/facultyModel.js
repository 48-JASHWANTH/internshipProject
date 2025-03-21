import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

// Check if the model already exists before defining it
const Faculty = mongoose.models.facultyCollection || mongoose.model("facultyCollection", new mongoose.Schema({
  // Required fields
  name: {
    type: String,
    required: true
  },
  facultyID: {
    type: String,
    required: true,
    unique: true
  },
  jntuhID: {
    type: String,
    default: ""
  },
  department: {
    type: String,
  },
  designation: {
    type: String,
  },
  password: {
    type: String,
    default: process.env.DEFAULT_PASSWORD
  },
  email: {
    type: String,
    default: ""
  },
  
  // Optional fields with defaults
  dob: {
    type: Date,
    default: null
  },
  workLocation: {
    type: String,
    default: ""
  },
  manager1: {
    type: String,
    default: ""
  },
  manager2: {
    type: String,
    default: ""
  },
  employmentType: {
    type: String,
    default: ""
  },
  teachType: {
    type: String,
    default: ""
  },
  shift: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "Active"
  },
  joiningDate: {
    type: Date,
    default: null
  },
  qualification: {
    type: String,
    default: ""
  },
  alternateEmail: {
    type: String,
    default: ""
  },
  emergencyContact: {
    type: String,
    default: ""
  },
  googleScholarID: {
    type: String,
    default: ""
  },
  vidwanID: {
    type: String,
    default: ""
  },
  profileImageURL: {
    type: String,
    default: ""
  },
  
  // Existing fields from current model
  phoneNumber: {
    type: String,
    default: ""
  },
  leadedProjects: [{
    type: String,
    default: []
  }],
  notifications: {
    type: [String],
    default: []
  },
  activeProjects: {
    type: Number,
    default: 0
  },
  archivedProjects: {
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
  },
  guidedProjects: {
    type: [String],
    default: []
  },
  
  // Soft delete fields
  softDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true }));

// Add middleware to filter out soft-deleted faculty if model was just created
if (!mongoose.models.facultyCollection) {
  // Global middleware to exclude soft-deleted faculty from all queries
  Faculty.schema.pre(/^find/, function() {
    // Only apply this filter if softDeleted is not explicitly set in the query
    if (this.getQuery().softDeleted === undefined) {
      this.where({ softDeleted: false });
    }
  });
}

export default Faculty;
