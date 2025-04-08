import mongoose from 'mongoose';

const projectForumSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    default: () => Date.now().toString()
  },
  Description: {
    type: String,
    required: [true, 'Project description is required']
  },
  Domain: {
    type: String,
    required: [true, 'Project domain is required']
  },
  Status: {
    type: String,
    enum: ['Open', 'Close'],
    default: 'Open'
  },
  TechStack: {
    type: [String],
    default: []
  },
  Title: {
    type: String,
    required: [true, 'Project title is required']
  },
  facultyId: {
    type: String,
    required: [true, 'Faculty ID is required'],
    ref: 'Faculty'
  },
  InterestedStudents: {
    type: [{
      studentID: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      branch: {
        type: String,
        required: true
      },
      mail: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProjectForum = mongoose.model('ProjectForum', projectForumSchema);

export default ProjectForum; 