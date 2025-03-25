// FacultyController.js
import asynchandler from "express-async-handler";
import Faculty from "../models/facultyModel.js";
import SectionTeams from "../models/sectionTeamsModel.js";
import Team from "../models/teamsModel.js";
import Student from "../models/studentModel.js";

// New entity created by faculty
export const createTeams = asynchandler(async (req, res) => {
    try {
        console.log(req.body);
        const { newSectionTeam, createdTeams } = req.body;
        const sectionTeam = new SectionTeams({
            classID: newSectionTeam.classID,
            year: newSectionTeam.year,
            sem: newSectionTeam.sem,
            branch: newSectionTeam.branch,
            section: newSectionTeam.section,
            projectType: newSectionTeam.projectType,
            facultyID: newSectionTeam.facultyID,
            numberOfTeams: newSectionTeam.numberOfTeams,
            teamsList: newSectionTeam.teamsList,
            projectTitles: newSectionTeam.projectTitles,
            numberOfStudents: newSectionTeam.numberOfStudents,
            status: newSectionTeam.status
        });

        await sectionTeam.save();

        const teamPromises = createdTeams.map(team => {
            return Team.findOneAndUpdate(
                { teamId: team.teamId },
                {
                    listOfStudents: team.listOfStudents,
                    projectTitle: team.projectTitle,
                    projectType: team.projectType,
                    subject: team.subject,
                    githubURL: "",
                    guideApproval: true,
                    guideFacultyId: team.guideFacultyId,
                    inchargefacultyId: team.inchargefacultyId
                },
                { upsert: true, new: true }
            );
        });

        await Promise.all(teamPromises);
        const projectTitlesArray = newSectionTeam.classID; // Extract values
        
        // Update leaded projects for faculty in charge
        await Faculty.findOneAndUpdate(
            { facultyID: newSectionTeam.facultyID },
            { $addToSet: { leadedProjects: newSectionTeam.classID } }, // No $each needed
            { new: true }
        );
        


        // Update guided projects for faculty guiding specific teams
        const facultyUpdatePromises = createdTeams.map(({ guideFacultyId, teamId }) =>
            Faculty.findOneAndUpdate(
                { facultyID: guideFacultyId },
                { $addToSet: { guidedProjects: teamId } },
                { new: true }
            )
        );

        await Promise.all(facultyUpdatePromises);
        console.log("Faculty projects updated successfully.");
        
        const studentUpdatePromises = createdTeams.flatMap(team =>
            team.listOfStudents.map(studentId =>
                Student.findOneAndUpdate(
                    { studentID: studentId },
                    { $addToSet: { projects: team.teamId } }, 
                    { new: true }
                )
            )
        );
        
        await Promise.all(studentUpdatePromises);
        

        res.status(201).json({ message: 'Section team, teams, and student project counts updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving section team, teams, or updating student projects', error: error.message });
        console.log(error.message);
    }
});

export const getAllFaculty = async (req, res) => {
  try {
    // Find all faculty members that are not soft deleted
    const faculty = await Faculty.find({ softDeleted: false })
      .select('facultyID name -_id') // Only return facultyID and name, exclude _id
      .lean();
    
    res.status(200).json({
      success: true,
      faculty
    });
  } catch (error) {
    console.error('Error fetching faculty list:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty list'
    });
  }
};

export const getLeadedProjects = async (req, res) => {
  try {
    const { facultyID } = req.params;
    
    // Find the faculty and get their leaded projects
    const faculty = await Faculty.findOne({ facultyID })
      .select('leadedProjects -_id')
      .lean();
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    const leadedProjects = faculty.leadedProjects || [];
    
    // If there are no leaded projects, return an empty array
    if (leadedProjects.length === 0) {
      return res.status(200).json({
        success: true,
        leadedProjects: [],
        sectionTeams: [],
        teams: []
      });
    }
    
    // Fetch the section teams data for each class ID
    const sectionTeams = await SectionTeams.find({ 
      classID: { $in: leadedProjects } 
    }).lean();
    
    // Get all teams for these sections by constructing team IDs
    // Format: classID_teamNumber
    const teamIds = [];
    sectionTeams.forEach(section => {
      if (section.teamsList) {
        // Get the keys of teamsList which are the team IDs
        Object.keys(section.teamsList).forEach(teamId => {
          teamIds.push(teamId);
        });
      }
    });
    
    // Fetch all teams data based on the extracted team IDs
    const teams = await Team.find({
      teamId: { $in: teamIds }
    }).lean();
    
    res.status(200).json({
      success: true,
      leadedProjects,
      sectionTeams,
      teams
    });
  } catch (error) {
    console.error('Error fetching faculty leaded projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty leaded projects'
    });
  }
};

// Get guided projects for a faculty
export const getGuidedProjects = async (req, res) => {
  try {
    const { facultyID } = req.params;
    
    // Find the faculty and get their guided projects
    const faculty = await Faculty.findOne({ facultyID })
      .select('guidedProjects -_id')
      .lean();
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    const guidedProjects = faculty.guidedProjects || [];
    
    // If there are no guided projects, return an empty array
    if (guidedProjects.length === 0) {
      return res.status(200).json({
        success: true,
        guidedProjects: [],
        teams: []
      });
    }
    
    // Fetch the teams data for each team ID
    const teams = await Team.find({ 
      teamId: { $in: guidedProjects } 
    }).lean();
    
    res.status(200).json({
      success: true,
      guidedProjects,
      teams
    });
  } catch (error) {
    console.error('Error fetching faculty guided projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty guided projects'
    });
  }
};

// Add a new task to a team's workboard
export const addTaskToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { 
      title, 
      description, 
      dueDate, 
      priority, 
      assignedTo,
      assignedBy 
    } = req.body;
    
    // Get faculty ID from the token
    const facultyID = req.user.email; // Assuming email is used as facultyID in the token
    
    // Validate required fields
    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title and due date are required'
      });
    }
    
    // Find the team
    const team = await Team.findOne({ teamId });
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    // Create new task
    const newTask = {
      title,
      description,
      dueDate,
      priority: priority || 'Medium',
      status: 'todo',
      assignedTo,
      assignedBy: assignedBy ? {
        ...assignedBy,
        facultyID: facultyID
      } : {
        name: "System",
        type: "Incharge",
        facultyID: facultyID
      },
      createdAt: new Date()
    };
    
    // Add task to team
    team.tasks.push(newTask);
    team.lastUpdated = new Date();
    
    await team.save();
    
    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Error adding task to team:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding task to team'
    });
  }
};

// Add a new review to a team
export const addReviewToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { 
      reviewNo, 
      reviewName, 
      dateOfReview, 
      dueDate, 
      satisfactionLevel, 
      remarks, 
      feedback, 
      progress, 
      changesToBeMade, 
      presentees,
      assignedBy 
    } = req.body;
    
    // Get faculty ID from the token
    const facultyID = req.user.email; // Assuming email is used as facultyID in the token
    
    // Validate required fields
    if (!reviewName) {
      return res.status(400).json({
        success: false,
        message: 'Review name is required'
      });
    }
    
    // Find the team
    const team = await Team.findOne({ teamId });
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    // Create new review
    const newReview = {
      reviewNo: reviewNo || team.reviews.length + 1,
      reviewName,
      dateOfReview: dateOfReview || new Date(),
      dueDate,
      satisfactionLevel,
      remarks,
      feedback,
      progress,
      changesToBeMade,
      presentees,
      reviewStatus: 'reviewed',
      assignedBy: assignedBy ? {
        ...assignedBy,
        facultyID: facultyID
      } : {
        name: "System",
        type: "Incharge",
        facultyID: facultyID
      }
    };
    
    // Add review to team
    team.reviews.push(newReview);
    team.lastUpdated = new Date();
    
    await team.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error adding review to team:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review to team'
    });
  }
};

// Get all tasks for a team
export const getTeamTasks = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Find the team
    const team = await Team.findOne({ teamId })
      .select('tasks teamId projectTitle')
      .lean();
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      success: true,
      teamId: team.teamId,
      projectTitle: team.projectTitle,
      tasks: team.tasks || []
    });
  } catch (error) {
    console.error('Error fetching team tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team tasks'
    });
  }
};

// Get all reviews for a team
export const getTeamReviews = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Find the team
    const team = await Team.findOne({ teamId })
      .select('reviews teamId projectTitle')
      .lean();
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      success: true,
      teamId: team.teamId,
      projectTitle: team.projectTitle,
      reviews: team.reviews || []
    });
  } catch (error) {
    console.error('Error fetching team reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team reviews'
    });
  }
};
