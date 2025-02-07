import mongoose from "mongoose";
const FacultySchema = new mongoose.Schema({
  facultyID: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  leadedProjects: [{
    type: String
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
  guidedProjects:{
    type: [String],
    default: []
  }
}, { timestamps: true });

const Faculty = mongoose.model("facultyCollection", FacultySchema);
export default Faculty
