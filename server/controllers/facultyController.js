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
        
        // Collect all student IDs from all teams
        const allStudentIds = createdTeams.flatMap(team => team.listOfStudents);
        
        // Fetch student details for all student IDs in a single query
        const students = await Student.find(
            { studentID: { $in: allStudentIds } },
            { studentID: 1, name: 1, batch: 1, _id: 0 }
        ).lean();
        
        // Extract batch from the first student that has a batch value
        let batch = '';
        for (const student of students) {
            if (student.batch) {
                batch = student.batch;
                break;
            }
        }
        
        // Create a map of studentID to student name for quick lookup
        const studentMap = {};
        students.forEach(student => {
            studentMap[student.studentID] = student.name;
        });
        
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
            status: newSectionTeam.status,
            batch: batch // Add the extracted batch
        });

        await sectionTeam.save();

        const teamPromises = createdTeams.map(team => {
            // Transform listOfStudents to include both ID and name
            const enhancedStudentList = team.listOfStudents.map(studentId => ({
                id: studentId,
                name: studentMap[studentId] || 'Unknown Student'
            }));
            
            return Team.findOneAndUpdate(
                { teamId: team.teamId },
                {
                    listOfStudents: enhancedStudentList,
                    projectTitle: team.projectTitle,
                    projectType: team.projectType,
                    subject: team.subject,
                    githubURL: "",
                    guideApproval: true,
                    guideFacultyId: team.guideFacultyId,
                    inchargefacultyId: team.inchargefacultyId,
                    batch: batch // Also add batch to each team
                },
                { upsert: true, new: true }
            );
        });

        await Promise.all(teamPromises);
        const projectTitlesArray = newSectionTeam.classID;
        
        // Update leaded projects for faculty in charge
        await Faculty.findOneAndUpdate(
            { facultyID: newSectionTeam.facultyID },
            { $addToSet: { leadedProjects: newSectionTeam.classID } },
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
            team.listOfStudents.map(studentId => {
                // If studentId is now an object with id and name, extract just the id
                const id = typeof studentId === 'object' ? studentId.id : studentId;
                return Student.findOneAndUpdate(
                    { studentID: id },
                    { $addToSet: { projects: team.teamId } }, 
                    { new: true }
                );
            })
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
    
    // Get the list of guided project IDs
    const guidedProjectIds = faculty.guidedProjects || [];
    
    if (guidedProjectIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No guided projects found',
        teams: []
      });
    }
    
    // Fetch all teams that this faculty guides
    const teams = await Team.find({ teamId: { $in: guidedProjectIds } })
      .lean();
    
    // Extract the class IDs from team IDs to find the section teams
    const classIds = teams.map(team => team.teamId.split('_')[0]);
    
    // Fetch section teams data
    const sectionTeams = await SectionTeams.find({ classID: { $in: classIds } })
      .select('classID branch year section sem batch')
      .lean();
    
    // Create a map of classID to section team details for quick lookup
    const sectionTeamMap = {};
    sectionTeams.forEach(section => {
      sectionTeamMap[section.classID] = {
        branch: section.branch,
        year: section.year,
        section: section.section,
        sem: section.sem,
        batch: section.batch
      };
    });
    
    // Enhance each team with section team details
    const enhancedTeams = teams.map(team => {
      const classId = team.teamId.split('_')[0];
      const sectionDetails = sectionTeamMap[classId] || {};
      
      return {
        ...team,
        branch: sectionDetails.branch || '',
        year: sectionDetails.year || '',
        section: sectionDetails.section || '',
        sem: sectionDetails.sem || '',
        // Use batch from team if available, otherwise from section
        batch: team.batch || sectionDetails.batch || ''
      };
    });
    
    res.status(200).json({
      success: true,
      teams: enhancedTeams
    });
  } catch (error) {
    console.error('Error fetching guided projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guided projects',
      error: error.message
    });
  }
};

// Add a new task to a team
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
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
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
    
    // Create new task with timestamp-based ID
    const taskId = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newTask = {
      taskId,
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
    
    // Create new review with timestamp-based ID
    const reviewId = `review_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Determine the correct facultyID based on the faculty type
    let reviewAssignedBy;
    
    if (assignedBy && assignedBy.type) {
      if (assignedBy.type === 'Guide') {
        reviewAssignedBy = {
          ...assignedBy,
          facultyID: team.guideFacultyId // Use the team's guideFacultyId
        };
      } else if (assignedBy.type === 'Incharge') {
        reviewAssignedBy = {
          ...assignedBy,
          facultyID: team.inchargefacultyId // Use the team's inchargefacultyId
        };
      } else {
        // For other types, use the faculty from token
        reviewAssignedBy = {
          ...assignedBy,
          facultyID: facultyID
        };
      }
    } else {
      // Default case if no assignedBy is provided
      reviewAssignedBy = {
        name: "System",
        type: "Incharge",
        facultyID: team.inchargefacultyId || facultyID
      };
    }
    
    const newReview = {
      reviewId,
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
      assignedBy: reviewAssignedBy
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

// Get faculty information by facultyID
export const getFacultyInfo = async (req, res) => {
  try {
    const { facultyID } = req.params;
    
    // Find the faculty by facultyID
    const faculty = await Faculty.findOne({ facultyID })
      .select('-password') // Exclude password from the response
      .lean();
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    res.status(200).json({
      success: true,
      faculty
    });
  } catch (error) {
    console.error('Error fetching faculty information:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty information'
    });
  }
};

// Update a task's status (including approval)
export const updateTaskStatus = async (req, res) => {
  try {
    const { teamId, taskId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['todo', 'in_progress', 'done', 'approved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
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
    
    // Find the task in the team's tasks array
    const taskIndex = team.tasks.findIndex(task => task.taskId === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Update the task status
    team.tasks[taskIndex].status = status;
    team.lastUpdated = new Date();
    
    await team.save();
    
    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task: team.tasks[taskIndex]
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task status'
    });
  }
};

export const completeClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { 
      facultyID, 
      completionDate, 
    } = req.body;
    
    // Verify the faculty is authorized to complete this class
    const faculty = await Faculty.findOne({ 
      facultyID, 
      leadedProjects: classId 
    });
    
    if (!faculty) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Faculty is not the incharge for this class'
      });
    }
    
    // Update the section team status to completed
    const updatedSection = await SectionTeams.findOneAndUpdate(
      { classID: classId },
      { 
        status: 'completed',
        completedAt: completionDate || new Date(),
      },
      { new: true }
    );
    
    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    // Find all teams associated with this class and update their status
    const teamPrefix = `${classId}_`;
    const updatedTeams = await Team.updateMany(
      { teamId: { $regex: new RegExp(`^${teamPrefix}`) } },
      { 
        status: true,
        completedAt: completionDate || new Date()
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Class marked as completed successfully',
      sectionTeam: updatedSection,
      teamsUpdated: updatedTeams.modifiedCount
    });
    
  } catch (error) {
    console.error('Error completing class:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing class',
      error: error.message
    });
  }
};

// Get faculty by facultyID
export const getFacultyById = async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID is required'
      });
    }
    
    const faculty = await Faculty.findOne({ facultyID: facultyId });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    // Convert to plain object and remove password
    const facultyData = faculty.toObject();
    delete facultyData.password;
    
    res.status(200).json({
      success: true,
      faculty: facultyData
    });
  } catch (error) {
    console.error('Error fetching faculty details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty details',
      error: error.message
    });
  }
};

// Update faculty data
export const updateFacultyData = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const updateData = req.body;
    
    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID is required'
      });
    }
    
    // Find the faculty
    const faculty = await Faculty.findOne({ facultyID: facultyId });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData._id;
    
    // Update the faculty data
    const updatedFaculty = await Faculty.findOneAndUpdate(
      { facultyID: facultyId },
      { $set: updateData },
      { new: true }
    );
    
    // Convert to plain object and remove password
    const facultyData = updatedFaculty.toObject();
    delete facultyData.password;
    
    res.status(200).json({
      success: true,
      message: 'Faculty data updated successfully',
      faculty: facultyData
    });
  } catch (error) {
    console.error('Error updating faculty data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating faculty data',
      error: error.message
    });
  }
};

// Get dashboard data for a faculty
export const getFacultyDashboardData = async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID is required'
      });
    }
    
    // Find the faculty
    const faculty = await Faculty.findOne({ facultyID: facultyId });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    // Extract faculty details
    const facultyDetails = {
      facultyID: faculty.facultyID,
      name: faculty.name,
      department: faculty.department,
      email: faculty.email,
      designation: faculty.designation,
      profileImage: faculty.profileImage
    };
    
    // Get the counts of leaded projects and guided projects
    const leadedProjectsCount = faculty.leadedProjects?.length || 0;
    const guidedProjectsCount = faculty.guidedProjects?.length || 0;
    
    // Get active projects (status: In Progress)
    // First, get all teams this faculty is guiding or leading
    const teamIds = faculty.guidedProjects || [];
    
    // Get all class IDs this faculty is leading
    const classIds = faculty.leadedProjects || [];
    
    // Get all teams in these classes
    let classTeamIds = [];
    if (classIds.length > 0) {
      const sectionTeams = await SectionTeams.find({ 
        classID: { $in: classIds },
        status: { $ne: 'completed' } // Not completed classes
      });
      
      sectionTeams.forEach(section => {
        if (section.teamsList) {
          Object.keys(section.teamsList).forEach(teamId => {
            classTeamIds.push(teamId);
          });
        }
      });
    }
    
    // Combine all team IDs (both guided and from led classes)
    const allTeamIds = [...new Set([...teamIds, ...classTeamIds])];
    
    // Get active and completed projects
    const activeProjects = await Team.find({
      teamId: { $in: allTeamIds },
      status: false // Not completed
    }).lean();
    
    const completedProjects = await Team.find({
      teamId: { $in: allTeamIds },
      status: true // Completed
    }).lean();
    
    // Get the count of students under guidance
    const studentCount = activeProjects.reduce((count, project) => {
      return count + (project.listOfStudents?.length || 0);
    }, 0);
    
    // Get pending approval tasks
    const pendingApprovals = await Team.countDocuments({
      teamId: { $in: allTeamIds },
      'tasks.status': 'done' // Tasks that are done but not yet approved
    });
    
    // Get project distribution data based on project types
    // First, get all section teams this faculty is involved with
    const sectionTeamData = await SectionTeams.find({
      $or: [
        { classID: { $in: classIds } },
        { facultyID: facultyId }
      ]
    }).lean();
    
    // Count projects by type
    const projectTypeCount = {};
    sectionTeamData.forEach(section => {
      const projectType = section.projectType;
      if (!projectTypeCount[projectType]) {
        projectTypeCount[projectType] = 0;
      }
      projectTypeCount[projectType] += section.numberOfTeams || 0;
    });
    
    // Format project distribution data for charts
    const projectDistributionData = Object.keys(projectTypeCount).map(type => {
      let color;
      switch(type) {
        case 'Major':
          color = '#8884d8'; // Purple
          break;
        case 'Mini':
          color = '#82ca9d'; // Green
          break;
        case 'CBP':
          color = '#ffc658'; // Yellow
          break;
        case 'FP':
          color = '#ff8042'; // Orange
          break;
        default:
          color = '#8dd1e1'; // Blue
      }
      
      return {
        name: type,
        value: projectTypeCount[type],
        color
      };
    });
    
    // Get project details by type for more detailed pie chart data
    const projectDetailsByType = {};
    
    // Gather active projects by type
    activeProjects.forEach(project => {
      const type = project.projectType;
      if (!projectDetailsByType[type]) {
        projectDetailsByType[type] = {
          active: 0,
          completed: 0,
          total: 0,
          projects: []
        };
      }
      
      projectDetailsByType[type].active += 1;
      projectDetailsByType[type].total += 1;
      projectDetailsByType[type].projects.push({
        id: project.teamId,
        title: project.projectTitle,
        status: 'active',
        subject: project.subject,
        teamSize: project.listOfStudents?.length || 0
      });
    });
    
    // Add completed projects by type
    completedProjects.forEach(project => {
      const type = project.projectType;
      if (!projectDetailsByType[type]) {
        projectDetailsByType[type] = {
          active: 0,
          completed: 0,
          total: 0,
          projects: []
        };
      }
      
      projectDetailsByType[type].completed += 1;
      projectDetailsByType[type].total += 1;
      projectDetailsByType[type].projects.push({
        id: project.teamId,
        title: project.projectTitle,
        status: 'completed',
        completedDate: project.completedDate,
        subject: project.subject,
        teamSize: project.listOfStudents?.length || 0
      });
    });
    
    // Format project type details for the enhanced pie chart
    const enhancedProjectDistribution = Object.keys(projectDetailsByType).map(type => {
      let color;
      switch(type) {
        case 'Major':
          color = '#8884d8'; // Purple
          break;
        case 'Mini':
          color = '#82ca9d'; // Green
          break;
        case 'CBP':
          color = '#ffc658'; // Yellow
          break;
        case 'FP':
          color = '#ff8042'; // Orange
          break;
        default:
          color = '#8dd1e1'; // Blue
      }
      
      return {
        name: type,
        value: projectDetailsByType[type].total,
        active: projectDetailsByType[type].active,
        completed: projectDetailsByType[type].completed,
        color,
        details: projectDetailsByType[type].projects.slice(0, 3) // Just include the first 3 for preview
      };
    });
    
    // Get workload data (monthly distribution)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Initialize workload data for all months
    const workloadData = months.map(month => ({
      month,
      assigned: 0,
      completed: 0
    }));
    
    // Count assigned projects by month
    activeProjects.forEach(project => {
      if (project.createdAt) {
        const month = new Date(project.createdAt).getMonth();
        workloadData[month].assigned += 1;
      }
    });
    
    // Count completed projects by month
    completedProjects.forEach(project => {
      if (project.completedDate) {
        const month = new Date(project.completedDate).getMonth();
        workloadData[month].completed += 1;
      }
    });
    
    // Get 5 recent active projects for display
    const recentActiveProjects = activeProjects
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map(project => {
        // Calculate progress based on tasks or reviews
        let progress = 0;
        const totalTasks = project.tasks?.length || 0;
        const completedTasks = project.tasks?.filter(task => 
          task.status === 'done' || task.status === 'approved'
        ).length || 0;
        
        if (totalTasks > 0) {
          progress = Math.round((completedTasks / totalTasks) * 100);
        } else if (project.reviews?.length > 0) {
          // If no tasks, estimate progress based on reviews
          const reviewCount = project.reviews.length;
          // Assuming 5 reviews is 100% progress
          progress = Math.min(Math.round((reviewCount / 5) * 100), 100);
        }
        
        return {
          id: project.teamId,
          name: project.projectTitle,
          class: project.subject || 'Not specified',
          progress,
          projectType: project.projectType
        };
      });
    
    // Get 5 recent archived projects
    const recentArchivedProjects = completedProjects
      .sort((a, b) => new Date(b.completedDate || b.updatedAt) - new Date(a.completedDate || a.updatedAt))
      .slice(0, 5)
      .map(project => ({
        id: project.teamId,
        name: project.projectTitle,
        class: project.subject || 'Not specified',
        projectType: project.projectType,
        completedDate: project.completedDate || project.updatedAt
      }));
    
    // For now, return empty array for forum projects and interested students
    // In a real implementation, you would fetch this data from the appropriate collection
    const forumProjects = [];
    const interestedStudents = [];
    
    // Compile all data
    const dashboardData = {
      faculty: facultyDetails,
      stats: {
        activeProjects: activeProjects.length,
        projectsCompleted: completedProjects.length,
        studentsUnderGuidance: studentCount,
        pendingApprovals,
        leadedProjects: leadedProjectsCount,
        guidedProjects: guidedProjectsCount,
        forumProjects: forumProjects.length
      },
      activeProjects: recentActiveProjects,
      archivedProjects: recentArchivedProjects,
      workloadData,
      projectDistributionData,
      enhancedProjectDistribution,
      projectDetailsByType,
      interestedStudents
    };
    
    res.status(200).json({
      success: true,
      dashboardData
    });
    
  } catch (error) {
    console.error('Error fetching faculty dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};
