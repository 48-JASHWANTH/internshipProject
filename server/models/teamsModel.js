import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewNo: { type: Number },
  dateOfReview: { type: Date, default: Date.now },
  progress: { type: String },
  changesToBeMade: { type: String },
  presentees: { type: [String] },
  reviewStatus:{type: Boolean,default: false}
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
  },
  completedDate:{
    type:Date,
    default:null
  }
}, { timestamps: true });

const Team = mongoose.model('teamsCollection', TeamSchema);
export default Team;
