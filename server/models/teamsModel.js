import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  ReviewNo: { type: Number },
  DateOfReview: { type: Date, default: Date.now },
  Progress: { type: String },
  ChangesToBeMade: { type: String },
  Presentees: { type: [String] }
});

const TeamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true
  },
  listOfStudents: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  projectTitle: {
    type: String,
    required: true
  },
  reviews: {
    type: [reviewSchema],
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
  }
}, { timestamps: true });

const Team = mongoose.model('teamsCollection', TeamSchema);
export default Team;
