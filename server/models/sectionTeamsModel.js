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
    batch: {
        type: String,
        default: ''
    },
    numberOfTeams: {
        type: Number,
        default: 0
    },
    teamsList: {
        type: Object,
        default: {}
    },
    projectTitles: {
        type: Map,
        of: String,
        default: new Map()
    },
    numberOfStudents: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'In Progress'
    },
    dueDate:{
        type:Date
    }
}, { timestamps: true });

const SectionTeams =  mongoose.models.sectionTeamsCollection || mongoose.model("sectionTeamsCollection", SectionTeamsSchema);
export default SectionTeams;