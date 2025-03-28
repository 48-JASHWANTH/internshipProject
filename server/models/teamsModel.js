import mongoose from "mongoose";

// Enhanced review schema based on InchargeReviews.jsx mock data
const reviewSchema = new mongoose.Schema({
  reviewName: { type: String, required: true },
  dateOfReview: { type: Date, default: Date.now },
  satisfactionLevel: { 
    type: String, 
    enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] 
  },
  remarks: { type: String },
  feedback: { type: String },
  progress: { type: String },
  changesToBeMade: { type: String },
  presentees: { type: [String] },
  reviewStatus: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
  assignedBy: {
    name: { type: String },
    type: { type: String, enum: ['Guide', 'Incharge', 'Admin'] },
    facultyID: { type: String }
  }
});

// New workboard schema based on InchargeWorkboard.jsx mock data
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { 
    type: String, 
    enum: ['todo', 'in_progress', 'done', 'approved'], 
    default: 'todo' 
  },
  assignedTo: { type: String },
  assignedBy: {
    name: { type: String },
    type: { type: String, enum: ['Guide', 'Incharge', 'Admin'] },
    facultyID: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Student schema for listOfStudents
const studentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true }
}, { _id: false });

const TeamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true
  },
  listOfStudents: {
    type: [studentSchema],
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  projectTitle: {
    type: String,
    required: true
  },
  projectOverview: {
    type: String,
    default: ""
  },
  googleDriveLink: {
    type: String,
    default: ""
  },
  techStack: {
    type: [String],
    default: []
  },
  reviews: {
    type: [reviewSchema],
    default: []
  },
  tasks: {
    type: [taskSchema],
    default: []
  },
  projectType: {
    type: String,
    required: true
  },
  subject: {
    type: String,
  },
  githubURL: {
    type: String,
  },
  guideApproval:{
    type: Boolean,
    default: false
  },
  inchargefacultyId:{
    type: String
  },
  guideFacultyId:{
    type: String
  },
  completedDate:{
    type:Date,
    default:null
  }
}, { timestamps: true });

const Team = mongoose.model('teamsCollection', TeamSchema);
export default Team;
