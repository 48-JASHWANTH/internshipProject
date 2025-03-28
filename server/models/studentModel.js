import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const StudentSchema = new mongoose.Schema(
  {
    studentID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: process.env.DEFAULT_PASSWORD,
    },
    mail: {
      type: String,
      default: function() {
        return this.studentID ? `${this.studentID}@vnrvjiet.in` : '';
      },
      unique: true,
      sparse: true
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    notifications: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    linkedInURL: {
      type: String,
      default: "",
    },
    githubURL: {
      type: String,
      default: "",
    },
    campus: {
      type: String,
      default: "",
    },
    batch: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    degree: {
      type: String,
      default: "",
    },
    tenth: {
      type: String,
      default: "",
    },
    twelfth: {
      type: String,
      default: "",
    },
    diploma: {
      type: String,
      default: "NA",
    },
    underGraduate: {
      type: String,
      default: "",
    },
    postGraduate: {
      type: String,
      default: "NA",
    },
    backlogsHistory: {
      type: String,
      default: "No",
    },
    currentBacklogs: {
      type: String,
      default: "0",
    },
    interestedInPlacement: {
      type: String,
      default: "Yes",
    },
    skills: {
      type: String,
      default: "",
    },
    languages: {
      type: String,
      default: "",
    },
    resumeFileId: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
  
  },
  { timestamps: true }
);


// Add a method to the schema to filter out inactive users by default
// StudentSchema.pre('find', function() {
//   this.where({ isActive: true });
// });

// StudentSchema.pre('findOne', function() {
//   this.where({ isActive: true });
// });

const Student = mongoose.model("studentsCollection", StudentSchema);
export default Student;
