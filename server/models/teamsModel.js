import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  ReviewNo: { type: Number },
  DateOfReview: { type: Date, default: Date.now },
  Progress: { type: String },
  ChangesToBeMade: { type: String },
  Presentees: { type: [String] }
});

const TeamSchema = new mongoose.Schema({
  TeamId: {
    type: String,
    required: true,
    unique: true
  },
  ListOfStudents: {
    type: [String],
    required: true
  },
  Status: {
    type: String,
    default: 'Pending'
  },
  LastUpdated: {
    type: Date,
    default: Date.now
  },
  ProjectTitle: {
    type: String,
    required: true
  },
  Reviews: {
    type: [reviewSchema],
    default: []
  },
  ProjectType: {
    type: String,
    required: true
  },
  Subject: {
    type: String,
    required: true
  },
  GithubURL: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Team = mongoose.model('teamsCollection', TeamSchema);
