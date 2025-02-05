import mongoose from "mongoose";
const SectionTeamsSchema = new mongoose.Schema({
    classID: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    sem: {
      type: Number,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    projectType: {
      type: String,
      required: true
    },
    facultyID: {
      type: String,
      required: true
    },
    numberOfTeams: {
      type: Number,
      default: 0
    },
    teamsList: {
      type: [{teamID: []}],
      default: []
    },
    projectTitles: {
      type: [{teamID: String}],
      default: []
    },
    numberOfStudents: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'Pending'
    }
  }, { timestamps: true });
  
  export const SectionTeams = mongoose.model('sectionTeamsCollection', SectionTeamsSchema);