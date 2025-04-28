import asynchandler from "express-async-handler";
import Team from "../models/teamsModel.js";

// Get all projects with basic details
export const getAllProjects = asynchandler(async (req, res) => {
  try {
    // Fetch all projects with only basic details
    const projects = await Team.find({}, {
      teamId: 1,
      projectTitle: 1,
      projectOverview: 1,
      projectType: 1,
      techStack: 1,
      batch: 1,
      subject: 1,
      listOfStudents: 1,
      lastUpdated: 1,
      guideFacultyId: 1,
      inchargefacultyId: 1,
      status: 1,
      _id: 0  // Exclude MongoDB _id field
    }).lean();
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
});

// Get project by ID
export const getProjectById = asynchandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Team.findOne({ teamId: projectId }, {
      teamId: 1,
      projectTitle: 1,
      projectOverview: 1,
      projectType: 1,
      techStack: 1,
      batch: 1,
      subject: 1,
      listOfStudents: 1,
      lastUpdated: 1,
      guideFacultyId: 1,
      inchargefacultyId: 1,
      status: 1,
      _id: 0
    }).lean();
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
}); 