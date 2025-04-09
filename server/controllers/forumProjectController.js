import asyncHandler from 'express-async-handler';
import ProjectForum from '../models/projectForumModel.js';
import Faculty from '../models/facultyModel.js';
import Student from '../models/studentModel.js';

// Create a new project
export const createProject = asyncHandler(async (req, res) => {
  try {
    const { Description, Domain, TechStack, Title, facultyId } = req.body;
    
    // Validate required fields
    if (!Description || !Domain || !Title || !facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Generate a unique timestamp-based ID
    const projectId = Date.now().toString();
    
    // Create the project
    const newProject = await ProjectForum.create({
      projectId,
      Description,
      Domain,
      TechStack: Array.isArray(TechStack) ? TechStack : [],
      Title,
      facultyId,
      Status: 'Open'
    });
    
    // Update the faculty's forumProjectsIds
    await Faculty.findOneAndUpdate(
      { facultyID: facultyId },
      { $addToSet: { forumProjectsIds: projectId } }
    );
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
});

// Get all projects
export const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const projects = await ProjectForum.find().sort({ createdAt: -1 });
    
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

// Get projects by faculty ID
export const getFacultyProjects = asyncHandler(async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    const projects = await ProjectForum.find({ facultyId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error fetching faculty projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty projects',
      error: error.message
    });
  }
});

// Update project status
export const updateProjectStatus = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !['Open', 'Close'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be "Open" or "Close"'
      });
    }
    
    const updatedProject = await ProjectForum.findOneAndUpdate(
      { projectId },
      { Status: status },
      { new: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project status updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project status',
      error: error.message
    });
  }
});

// Express interest in a project
export const expressInterest = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { studentID, mail } = req.body;
    
    // Check if project exists
    const project = await ProjectForum.findOne({ projectId });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if project is open
    if (project.Status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'This project is not open for interest'
      });
    }
    
    // Check if student has already expressed interest
    const alreadyInterested = project.InterestedStudents.some(
      student => student.studentID === studentID
    );
    
    if (alreadyInterested) {
      return res.status(400).json({
        success: false,
        message: 'You have already expressed interest in this project'
      });
    }

    // Fetch student details from student model
    const student = await Student.findOne({ studentID });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Add student to interested students with details from student model
    project.InterestedStudents.push({
      studentID,
      name: student.name,
      branch: student.department,
      mail,
      date: new Date()
    });
    
    await project.save();
    
    res.status(200).json({
      success: true,
      message: 'Interest expressed successfully',
      project
    });
  } catch (error) {
    console.error('Error expressing interest:', error);
    res.status(500).json({
      success: false,
      message: 'Error expressing interest',
      error: error.message
    });
  }
});

// Get project details by projectId
export const getProjectDetails = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }
    
    const project = await ProjectForum.findOne({ projectId });
    
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
    console.error('Error fetching project details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project details',
      error: error.message
    });
  }
}); 