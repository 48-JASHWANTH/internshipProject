import Student from "../models/studentModel.js";
import Team from "../models/teamsModel.js";
import Faculty from "../models/facultyModel.js";
import SectionTeams from "../models/sectionTeamsModel.js";
import ProjectForum from "../models/projectForumModel.js";

export const updateStudentAcademicData = async (req, res) => {
    try {
      const { studentID } = req.params;
      const updateFields = req.body;
  
      const updatedStudent = await Student.findOneAndUpdate(
        { studentID },
        { $set: updateFields },
        { new: true, projection: { _id: 0, studentID: 1, ...updateFields } }
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

export const updateStudentAdditional = async (req, res) => {
    try {
      const student = await Student.findOneAndUpdate(
        { studentID: req.params.studentID },
        { $set: req.body },
        { new: true }
      );
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const updateStudentPersonal = async (req, res) => {
    try {
      const { studentID } = req.params;
      const { name, mail, phone, gender, dateOfBirth } = req.body;
  
      const updatedStudent = await Student.findOneAndUpdate(
        { studentID },
        { name, mail, phone, gender, dateOfBirth },
        { new: true }
      );
  
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const updateStudentSocial = async (req, res) => {
  try {
    const { studentID } = req.params;
    const { github, linkedin } = req.body;

    // Validate URLs
    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (error) {
        return false;
      }
    };

    if (github && !isValidUrl(github)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid GitHub URL' 
      });
    }

    if (linkedin && !isValidUrl(linkedin)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid LinkedIn URL' 
      });
    }

    // Update student social links with correct field names matching the model
    const updatedStudent = await Student.findOneAndUpdate(
      { studentID },
      { githubURL: github, linkedInURL: linkedin },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Social links updated successfully',
      data: {
        github: updatedStudent.githubURL,
        linkedin: updatedStudent.linkedInURL
      }
    });
  } catch (error) {
    console.error('Error updating student social links:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getStudentDashBoardDetails = async (req, res) => {
    try {
      const { studentID } = req.params;
  
      // Get student details
      const student = await Student.findOne({ studentID }).select("name");
      if (!student) return res.status(404).json({ message: "Student not found" });
  
      // Get teams where student is a member
      const teams = await Team.find({ listOfStudents: studentID });
  
      // Get all project titles
      const projectTitles = teams.map(team => team.projectTitle);
  
      // Get assigned and completed projects
      const assignedProjects = teams.filter(team => !team.status).length;
      const completedProjects = teams.filter(team => team.status).length;
  
      // Get all reviews and count pending reviews
      const reviews = teams.flatMap(team => team.reviews);
      const pendingReviews = reviews.filter(review => review.reviewStatus === "False").length;
      
      // Get DateOfReview and ReviewStatus
      const reviewDetails = reviews.map(review => ({
        dateOfReview: review.DateOfReview,
        reviewStatus: review.reviewStatus
      }));
  
      // Get faculty details for guideFacultyId
      const facultyIds = teams.map(team => team.guideFacultyId).filter(Boolean);
      const guideFaculties = await Faculty.find({ facultyID: { $in: facultyIds } }).select("name facultyID dueDate");
  
      res.json({
        studentName: student.name,
        projectTitles,
        guideFaculties,
        reviewDetails,
        assignedProjects,
        completedProjects,
        pendingReviews,
        dueDates: guideFaculties.map(faculty => ({
          facultyID: faculty.facultyID,
          dueDate: faculty.dueDate || null
        }))
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  
  export const getStudentActiveWorks = async (req, res) => {
    try {
      const { studentID } = req.params;
  
      // Get teams where student is a member and status is false (In Progress)
      const teams = await Team.find({ 
        listOfStudents: { 
          $elemMatch: { 
            id: studentID 
          } 
        }, 
        status: false 
      });
  
      if (!teams.length) {
        return res.status(404).json({ 
          success: false,
          message: "No active projects found" 
        });
      }
  
      // Get project details with all required information
      const projectDetails = await Promise.all(
        teams.map(async team => {
          // Fetch guide faculty details
          const guideFaculty = await Faculty.findOne({ 
            facultyID: team.guideFacultyId 
          }).select("name facultyID email");
  
          // Fetch incharge faculty details
          const inchargeFaculty = await Faculty.findOne({ 
            facultyID: team.inchargefacultyId 
          }).select("name facultyID email");
  
          // Debug reviews data
          console.log(`Team ${team.teamId} has ${team.reviews.length} reviews`);
          console.log('Guide ID:', team.guideFacultyId);
          console.log('Incharge ID:', team.inchargefacultyId);
          
          // First classify reviews based on explicit faculty ID matches
          const matchedGuideReviews = team.reviews.filter(review => 
            review.assignedBy?.facultyID === team.guideFacultyId || 
            (review.assignedBy?.type === 'Guide' && review.assignedBy?.facultyID)
          );
          
          const matchedInchargeReviews = team.reviews.filter(review => 
            review.assignedBy?.facultyID === team.inchargefacultyId || 
            (review.assignedBy?.type === 'Incharge' && review.assignedBy?.facultyID)
          );
          
          // Find any unmatched reviews
          const matchedReviewIds = [...matchedGuideReviews, ...matchedInchargeReviews]
            .map(r => r._id.toString());
          
          const unmatchedReviews = team.reviews.filter(review => 
            !matchedReviewIds.includes(review._id.toString())
          );
          
          console.log(`Matched ${matchedGuideReviews.length} guide reviews`);
          console.log(`Matched ${matchedInchargeReviews.length} incharge reviews`);
          console.log(`Found ${unmatchedReviews.length} unmatched reviews`);
          
          // Categorize the unmatched reviews based on type if available
          const additionalGuideReviews = unmatchedReviews.filter(r => 
            r.assignedBy?.type === 'Guide' || 
            r.reviewName?.toLowerCase().includes('guide')
          );
          
          const additionalInchargeReviews = unmatchedReviews.filter(r => 
            r.assignedBy?.type === 'Incharge' || 
            r.reviewName?.toLowerCase().includes('incharge')
          );
          
          // Combine all reviews
          const guideReviews = [...matchedGuideReviews, ...additionalGuideReviews]
            .sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
          
          const inchargeReviews = [...matchedInchargeReviews, ...additionalInchargeReviews]
            .sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
          
          // Any remaining unmatched reviews that couldn't be categorized
          const reallyUnmatched = unmatchedReviews.filter(r => 
            !additionalGuideReviews.includes(r) && !additionalInchargeReviews.includes(r)
          );
          
          if (reallyUnmatched.length > 0) {
            console.log(`Found ${reallyUnmatched.length} truly uncategorized reviews`);
            
            // Try to categorize based on faculty ID comparison if possible
            for (const review of reallyUnmatched) {
              if (review.assignedBy?.facultyID) {
                if (review.assignedBy.facultyID === team.guideFacultyId) {
                  console.log(`Assigning review ${review._id} to guide based on facultyID match`);
                  guideReviews.push(review);
                } else if (review.assignedBy.facultyID === team.inchargefacultyId) {
                  console.log(`Assigning review ${review._id} to incharge based on facultyID match`);
                  inchargeReviews.push(review);
                } else {
                  // Default uncategorized reviews to incharge since that was the previous behavior
                  console.log(`Defaulting review ${review._id} to incharge (faculty ID doesn't match either)`);
                  inchargeReviews.push(review);
                }
              } else {
                // If no assignedBy.facultyID, check type one more time
                if (review.assignedBy?.type === 'Guide') {
                  console.log(`Assigning review ${review._id} to guide based on type`);
                  guideReviews.push(review);
                } else {
                  // Default to incharge as before
                  console.log(`Defaulting review ${review._id} to incharge (no faculty ID)`);
                  inchargeReviews.push(review);
                }
              }
            }
          }
  
          // Get last review date
          const lastReview = team.reviews.length > 0 
            ? new Date(Math.max(...team.reviews.map(r => new Date(r.dateOfReview))))
            : null;
  
          // Get project start date from createdAt
          const startDate = team.createdAt;
  
          // Get team members details
          const teamMembers = await Student.find(
            { studentID: { $in: team.listOfStudents.map(s => s.id) } }
          ).select("name studentID email");
  
          // Sort tasks by creation date (newest first)
          const sortedTasks = [...team.tasks].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
  
          return {
            teamId: team.teamId,
            projectDetails: {
              projectTitle: team.projectTitle,
              projectType: team.projectType,
              projectStatus: "In Progress",
              startDate,
              lastReviewDate: lastReview,
              numberOfTeamMembers: team.listOfStudents.length,
              projectOverview: team.projectOverview,
              githubURL: team.githubURL,
              googleDriveLink: team.googleDriveLink,
              techStack: team.techStack,
              abstractPdfId: team.abstractPdfId,
              subject: team.subject || null
            },
            facultyDetails: {
              guide: guideFaculty ? {
                name: guideFaculty.name,
                facultyID: guideFaculty.facultyID,
                email: guideFaculty.email
              } : null,
              inchargeFaculty: inchargeFaculty ? {
                name: inchargeFaculty.name,
                facultyID: inchargeFaculty.facultyID,
                email: inchargeFaculty.email
              } : null
            },
            teamDetails: {
              members: teamMembers.map(member => ({
                name: member.name,
                studentID: member.studentID,
                email: member.email
              }))
            },
            workDetails: {
              tasks: sortedTasks.map(task => ({
                _id: task._id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                status: task.status,
                assignedTo: task.assignedTo,
                assignedBy: task.assignedBy,
                createdAt: task.createdAt
              })),
              reviews: {
                lastReviewDate: lastReview,
                guideReviews: guideReviews.map(review => {
                  if (!review || !review._id) {
                    console.error('Invalid guide review found:', review);
                    return null;
                  }
                  return {
                    _id: review._id,
                    reviewName: review.reviewName || 'Untitled Review',
                    dateOfReview: review.dateOfReview || new Date(),
                    satisfactionLevel: review.satisfactionLevel || 'Good',
                    remarks: review.remarks || '',
                    feedback: review.feedback || '',
                    progress: review.progress || '',
                    changesToBeMade: review.changesToBeMade || '',
                    presentees: review.presentees || [],
                    reviewStatus: review.reviewStatus || 'pending',
                    assignedBy: review.assignedBy || { type: 'Guide' }
                  };
                }).filter(Boolean),
                inchargeReviews: inchargeReviews.map(review => {
                  if (!review || !review._id) {
                    console.error('Invalid incharge review found:', review);
                    return null;
                  }
                  return {
                    _id: review._id,
                    reviewName: review.reviewName || 'Untitled Review',
                    dateOfReview: review.dateOfReview || new Date(),
                    satisfactionLevel: review.satisfactionLevel || 'Good',
                    remarks: review.remarks || '',
                    feedback: review.feedback || '',
                    progress: review.progress || '',
                    changesToBeMade: review.changesToBeMade || '',
                    presentees: review.presentees || [],
                    reviewStatus: review.reviewStatus || 'pending',
                    assignedBy: review.assignedBy || { type: 'Incharge' }
                  };
                }).filter(Boolean)
              }
            }
          };
        })
      );
  
      res.status(200).json({ 
        success: true,
        totalProjects: projectDetails.length,
        activeProjects: projectDetails 
      });
  
    } catch (error) {
      console.error('Error fetching active works:', error);
      res.status(500).json({ 
        success: false,
        message: "Server Error", 
        error: error.message 
      });
    }
  };
  
  
  export const getStudentArchive = async (req, res) => {
    try {
      const { studentID } = req.params;
  
      // Get teams where student is a member and status is true (Completed)
      const teams = await Team.find({ 
        listOfStudents: { 
          $elemMatch: { 
            id: studentID 
          } 
        }, 
        status: true 
      });
  
      if (!teams.length) {
        return res.status(404).json({ 
          success: false,
          message: "No archived projects found" 
        });
      }
  
      // Get project details with all required information
      const projectDetails = await Promise.all(
        teams.map(async team => {
          // Fetch guide faculty details
          const guideFaculty = await Faculty.findOne({ 
            facultyID: team.guideFacultyId 
          }).select("name facultyID email");
  
          // Fetch incharge faculty details
          const inchargeFaculty = await Faculty.findOne({ 
            facultyID: team.inchargefacultyId 
          }).select("name facultyID email");
  
          // Separate guide and incharge reviews
          // First classify reviews based on explicit faculty ID matches
          const matchedGuideReviews = team.reviews.filter(review => 
            review.assignedBy?.facultyID === team.guideFacultyId || 
            (review.assignedBy?.type === 'Guide' && review.assignedBy?.facultyID)
          );
          
          const matchedInchargeReviews = team.reviews.filter(review => 
            review.assignedBy?.facultyID === team.inchargefacultyId || 
            (review.assignedBy?.type === 'Incharge' && review.assignedBy?.facultyID)
          );
          
          // Find any unmatched reviews
          const matchedReviewIds = [...matchedGuideReviews, ...matchedInchargeReviews]
            .map(r => r._id.toString());
          
          const unmatchedReviews = team.reviews.filter(review => 
            !matchedReviewIds.includes(review._id.toString())
          );
          
          // Categorize the unmatched reviews based on type if available
          const additionalGuideReviews = unmatchedReviews.filter(r => 
            r.assignedBy?.type === 'Guide' || 
            r.reviewName?.toLowerCase().includes('guide')
          );
          
          const additionalInchargeReviews = unmatchedReviews.filter(r => 
            r.assignedBy?.type === 'Incharge' || 
            r.reviewName?.toLowerCase().includes('incharge')
          );
          
          // Combine all reviews
          const guideReviews = [...matchedGuideReviews, ...additionalGuideReviews]
            .sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
          
          const inchargeReviews = [...matchedInchargeReviews, ...additionalInchargeReviews]
            .sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
          
          // Any remaining unmatched reviews that couldn't be categorized
          const reallyUnmatched = unmatchedReviews.filter(r => 
            !additionalGuideReviews.includes(r) && !additionalInchargeReviews.includes(r)
          );
          
          if (reallyUnmatched.length > 0) {
            // Try to categorize based on faculty ID comparison if possible
            for (const review of reallyUnmatched) {
              if (review.assignedBy?.facultyID) {
                if (review.assignedBy.facultyID === team.guideFacultyId) {
                  guideReviews.push(review);
                } else if (review.assignedBy.facultyID === team.inchargefacultyId) {
                  inchargeReviews.push(review);
                } else {
                  // Default uncategorized reviews to incharge since that was the previous behavior
                  inchargeReviews.push(review);
                }
              } else {
                // If no assignedBy.facultyID, check type one more time
                if (review.assignedBy?.type === 'Guide') {
                  guideReviews.push(review);
                } else {
                  // Default to incharge as before
                  inchargeReviews.push(review);
                }
              }
            }
          }
  
          // Get last review date
          const lastReview = team.reviews.length > 0 
            ? new Date(Math.max(...team.reviews.map(r => new Date(r.dateOfReview))))
            : null;
  
          // Get team members details
          const teamMembers = await Student.find(
            { studentID: { $in: team.listOfStudents.map(s => s.id) } }
          ).select("name studentID email");
  
          // Sort tasks by creation date (newest first)
          const sortedTasks = [...team.tasks].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
  
          return {
            teamId: team.teamId,
            projectDetails: {
              projectTitle: team.projectTitle,
              projectType: team.projectType,
              projectStatus: "Completed",
              startDate: team.createdAt,
              completedDate: team.completedDate,
              lastReviewDate: lastReview,
              numberOfTeamMembers: team.listOfStudents.length,
              projectOverview: team.projectOverview,
              objectives: team.objectives || [],
              outcomes: team.outcomes || [],
              githubURL: team.githubURL,
              googleDriveLink: team.googleDriveLink,
              techStack: team.techStack || [],
              abstractPdfId: team.abstractPdfId,
              subject: team.subject || null,
              department: team.branch || team.department || "Not Specified"
            },
            facultyDetails: {
              guide: guideFaculty ? {
                name: guideFaculty.name,
                facultyID: guideFaculty.facultyID,
                email: guideFaculty.email
              } : null,
              inchargeFaculty: inchargeFaculty ? {
                name: inchargeFaculty.name,
                facultyID: inchargeFaculty.facultyID,
                email: inchargeFaculty.email
              } : null
            },
            teamDetails: {
              members: teamMembers.map(member => ({
                name: member.name,
                studentID: member.studentID,
                email: member.email
              }))
            },
            workDetails: {
              tasks: sortedTasks.map(task => ({
                _id: task._id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                status: task.status,
                assignedTo: task.assignedTo,
                assignedBy: task.assignedBy,
                createdAt: task.createdAt
              })),
              reviews: {
                lastReviewDate: lastReview,
                guideReviews: guideReviews.map(review => ({
                  _id: review._id,
                  reviewName: review.reviewName,
                  dateOfReview: review.dateOfReview,
                  satisfactionLevel: review.satisfactionLevel,
                  remarks: review.remarks,
                  feedback: review.feedback,
                  progress: review.progress,
                  changesToBeMade: review.changesToBeMade,
                  presentees: review.presentees,
                  reviewStatus: review.reviewStatus,
                  assignedBy: review.assignedBy
                })),
                inchargeReviews: inchargeReviews.map(review => ({
                  _id: review._id,
                  reviewName: review.reviewName,
                  dateOfReview: review.dateOfReview,
                  satisfactionLevel: review.satisfactionLevel,
                  remarks: review.remarks,
                  feedback: review.feedback,
                  progress: review.progress,
                  changesToBeMade: review.changesToBeMade,
                  presentees: review.presentees,
                  reviewStatus: review.reviewStatus,
                  assignedBy: review.assignedBy
                }))
              }
            }
          };
        })
      );
  
      res.status(200).json({ 
        success: true,
        totalProjects: projectDetails.length,
        completedProjects: projectDetails 
      });
  
    } catch (error) {
      console.error('Error fetching archived projects:', error);
      res.status(500).json({ 
        success: false,
        message: "Server Error", 
        error: error.message 
      });
    }
  };
  
  
  export const getCampusProjects = async (req, res) => {
    try {
      const teams = await Team.find().select("projectTitle teamID status");
  
      if (!teams.length) return res.status(404).json({ message: "No projects found" });
  
      res.json({ projects: teams });
  
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

export const getStudentData = async (req, res) => {
  try {
    const { studentID } = req.params;

    const student = await Student.findOne({ studentID });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Combine all student data
    const studentData = {
      // Personal data
      personal: {
        name: student.name,
        mail: student.mail,
        phone: student.phone,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        github: student.githubURL,
        linkedin: student.linkedInURL
      },
      // Academic data
      academic: {
        campus: student.campus,
        batch: student.batch,
        department: student.department,
        degree: student.degree,
        tenth: student.tenth,
        twelfth: student.twelfth,
        diploma: student.diploma,
        underGraduate: student.underGraduate,
        postGraduate: student.postGraduate
      },
      // Additional data
      additional: {
        backlogsHistory: student.backlogsHistory,
        currentBacklogs: student.currentBacklogs,
        interestedInPlacement: student.interestedInPlacement,
        skills: student.skills,
        languages: student.languages
      }
    };

    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProjectGithub = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { githubURL } = req.body;

    const team = await Team.findOneAndUpdate(
      { teamId },
      { $set: { githubURL } },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "GitHub URL updated successfully",
      githubURL: team.githubURL
    });

  } catch (error) {
    console.error('Error updating GitHub URL:', error);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: error.message 
    });
  }
};

export const updateProjectDrive = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { googleDriveLink } = req.body;

    const team = await Team.findOneAndUpdate(
      { teamId },
      { $set: { googleDriveLink } },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Google Drive link updated successfully",
      googleDriveLink: team.googleDriveLink
    });

  } catch (error) {
    console.error('Error updating Drive link:', error);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: error.message 
    });
  }
};

export const updateProjectOverview = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { projectOverview } = req.body;

    const team = await Team.findOneAndUpdate(
      { teamId },
      { $set: { projectOverview } },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Project overview updated successfully",
      projectOverview: team.projectOverview
    });

  } catch (error) {
    console.error('Error updating project overview:', error);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: error.message 
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { teamId, taskId } = req.params;
    const { status } = req.body;

    // Validate taskId
    if (!taskId || taskId === 'undefined') {
      return res.status(400).json({
        success: false,
        message: "Task ID is required"
      });
    }

    // Convert frontend status to backend status format
    const backendStatus = status === 'Done' ? 'done' : 
                         status === 'In Progress' ? 'in-progress' : 'todo';

    const team = await Team.findOneAndUpdate(
      { 
        teamId,
        'tasks._id': taskId 
      },
      { 
        $set: { 
          'tasks.$.status': backendStatus,
          'tasks.$.updatedAt': new Date()
        } 
      },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: "Team or task not found" 
      });
    }

    const updatedTask = team.tasks.find(task => task._id.toString() === taskId);

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: error.message 
    });
  }
};

export const getTeamReviews = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Find the team
    const team = await Team.findOne({ teamId });
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Debug reviews data
    console.log(`Team ${team.teamId} has ${team.reviews.length} reviews`);
    console.log('Guide ID:', team.guideFacultyId);
    console.log('Incharge ID:', team.inchargefacultyId);
    
    // First classify reviews based on explicit faculty ID matches
    const matchedGuideReviews = team.reviews.filter(review => 
      review.assignedBy?.facultyID === team.guideFacultyId || 
      (review.assignedBy?.type === 'Guide' && review.assignedBy?.facultyID)
    );
    
    const matchedInchargeReviews = team.reviews.filter(review => 
      review.assignedBy?.facultyID === team.inchargefacultyId || 
      (review.assignedBy?.type === 'Incharge' && review.assignedBy?.facultyID)
    );
    
    // Find any unmatched reviews
    const matchedReviewIds = [...matchedGuideReviews, ...matchedInchargeReviews]
      .map(r => r._id.toString());
    
    const unmatchedReviews = team.reviews.filter(review => 
      !matchedReviewIds.includes(review._id.toString())
    );
    
    console.log(`Matched ${matchedGuideReviews.length} guide reviews`);
    console.log(`Matched ${matchedInchargeReviews.length} incharge reviews`);
    console.log(`Found ${unmatchedReviews.length} unmatched reviews`);
    
    // Categorize the unmatched reviews based on type if available
    const additionalGuideReviews = unmatchedReviews.filter(r => 
      r.assignedBy?.type === 'Guide' || 
      r.reviewName?.toLowerCase().includes('guide')
    );
    
    const additionalInchargeReviews = unmatchedReviews.filter(r => 
      r.assignedBy?.type === 'Incharge' || 
      r.reviewName?.toLowerCase().includes('incharge')
    );
    
    // Combine all reviews
    const guideReviews = [...matchedGuideReviews, ...additionalGuideReviews]
      .sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
    
    const inchargeReviews = [...matchedInchargeReviews, ...additionalInchargeReviews]
      .sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
    
    // Any remaining unmatched reviews that couldn't be categorized
    const reallyUnmatched = unmatchedReviews.filter(r => 
      !additionalGuideReviews.includes(r) && !additionalInchargeReviews.includes(r)
    );
    
    if (reallyUnmatched.length > 0) {
      console.log(`Found ${reallyUnmatched.length} truly uncategorized reviews`);
      
      // Try to categorize based on faculty ID comparison if possible
      for (const review of reallyUnmatched) {
        if (review.assignedBy?.facultyID) {
          if (review.assignedBy.facultyID === team.guideFacultyId) {
            console.log(`Assigning review ${review._id} to guide based on facultyID match`);
            guideReviews.push(review);
          } else if (review.assignedBy.facultyID === team.inchargefacultyId) {
            console.log(`Assigning review ${review._id} to incharge based on facultyID match`);
            inchargeReviews.push(review);
          } else {
            // Default uncategorized reviews to incharge since that was the previous behavior
            console.log(`Defaulting review ${review._id} to incharge (faculty ID doesn't match either)`);
            inchargeReviews.push(review);
          }
        } else {
          // If no assignedBy.facultyID, check type one more time
          if (review.assignedBy?.type === 'Guide') {
            console.log(`Assigning review ${review._id} to guide based on type`);
            guideReviews.push(review);
          } else {
            // Default to incharge as before
            console.log(`Defaulting review ${review._id} to incharge (no faculty ID)`);
            inchargeReviews.push(review);
          }
        }
      }
    }

    // Get last review date
    const lastReview = team.reviews.length > 0 
      ? new Date(Math.max(...team.reviews.map(r => new Date(r.dateOfReview))))
      : null;

    res.status(200).json({
      success: true,
      teamId: team.teamId,
      reviews: {
        lastReviewDate: lastReview,
        guideReviews: guideReviews.map(review => {
          if (!review || !review._id) {
            console.error('Invalid guide review found:', review);
            return null;
          }
          return {
            _id: review._id,
            reviewName: review.reviewName || 'Untitled Review',
            dateOfReview: review.dateOfReview || new Date(),
            satisfactionLevel: review.satisfactionLevel || 'Good',
            remarks: review.remarks || '',
            feedback: review.feedback || '',
            progress: review.progress || '',
            changesToBeMade: review.changesToBeMade || '',
            presentees: review.presentees || [],
            reviewStatus: review.reviewStatus || 'pending',
            assignedBy: review.assignedBy || { type: 'Guide' }
          };
        }).filter(Boolean),
        inchargeReviews: inchargeReviews.map(review => {
          if (!review || !review._id) {
            console.error('Invalid incharge review found:', review);
            return null;
          }
          return {
            _id: review._id,
            reviewName: review.reviewName || 'Untitled Review',
            dateOfReview: review.dateOfReview || new Date(),
            satisfactionLevel: review.satisfactionLevel || 'Good',
            remarks: review.remarks || '',
            feedback: review.feedback || '',
            progress: review.progress || '',
            changesToBeMade: review.changesToBeMade || '',
            presentees: review.presentees || [],
            reviewStatus: review.reviewStatus || 'pending',
            assignedBy: review.assignedBy || { type: 'Incharge' }
          };
        }).filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Error getting team reviews:', error);
    res.status(500).json({
      success: false, 
      message: 'Error getting team reviews'
    });
  }
};

export const getTeamTasks = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Find the team
    const team = await Team.findOne({ teamId });
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Sort tasks by creation date (newest first)
    const sortedTasks = [...team.tasks].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      teamId: team.teamId,
      tasks: sortedTasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo,
        assignedBy: task.assignedBy,
        createdAt: task.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching team tasks:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getStudentDashboardData = async (req, res) => {
  try {
    const { studentID } = req.params;

    // Get student details
    const student = await Student.findOne({ studentID }).select("name department studentID");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Get all teams (both active and completed) where student is a member
    const teams = await Team.find({
      'listOfStudents.id': studentID
    });

    // Calculate stats
    const stats = {
      activeProjects: teams.filter(team => !team.status).length,
      completedProjects: teams.filter(team => team.status).length,
      pendingTasks: teams.reduce((acc, team) => {
        return acc + team.tasks.filter(task => task.status !== 'done').length;
      }, 0),
    };

    // Get active projects with progress
    const activeProjects = await Promise.all(teams
      .filter(team => !team.status)
      .map(async team => {
        const guideFaculty = await Faculty.findOne({ facultyID: team.guideFacultyId })
          .select("name");

        const totalTasks = team.tasks.length;
        const completedTasks = team.tasks.filter(task => task.status === 'done').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          id: team.teamId,
          name: team.projectTitle,
          facultyGuide: guideFaculty ? guideFaculty.name : 'Not Assigned',
          progress,
          projectType: team.projectType
        };
      }));

    // Get archived projects
    const archivedProjects = await Promise.all(teams
      .filter(team => team.status)
      .map(async team => {
        const guideFaculty = await Faculty.findOne({ facultyID: team.guideFacultyId })
          .select("name");

        return {
          id: team.teamId,
          name: team.projectTitle,
          facultyGuide: guideFaculty ? guideFaculty.name : 'Not Assigned',
          projectType: team.projectType,
          completedDate: team.completedDate
        };
      }));

    // Get task completion data (last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const taskCompletionData = await Promise.all([...Array(4)].map(async (_, index) => {
      const weekStart = new Date(fourWeeksAgo);
      weekStart.setDate(weekStart.getDate() + (index * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekTasks = teams.flatMap(team => 
        team.tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= weekStart && taskDate < weekEnd;
        })
      );

      return {
        week: `Week ${index + 1}`,
        assigned: weekTasks.length,
        completed: weekTasks.filter(task => task.status === 'done').length
      };
    }));

    // Get project distribution
    const projectDistribution = teams.reduce((acc, team) => {
      const type = team.projectType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const projectDistributionData = Object.entries(projectDistribution).map(([name, value]) => ({
      name,
      value,
      color: name === 'Major' ? '#8884d8' : 
             name === 'Mini' ? '#82ca9d' : 
             name === 'CBP' ? '#ffc658' : '#ff8042'
    }));

    // Get forum projects with interest status
    const forumProjects = await ProjectForum.find()
      .limit(4)
      .sort({ createdAt: -1 });

    const forumProjectsWithDetails = await Promise.all(forumProjects.map(async project => {
      const faculty = await Faculty.findOne({ facultyID: project.facultyId })
        .select("name");

      const hasExpressedInterest = project.InterestedStudents.some(
        student => student.studentID === studentID
      );

      return {
        id: project.projectId,
        title: project.Title,
        faculty: faculty ? faculty.name : 'Not Assigned',
        domain: project.Domain,
        status: project.Status,
        interest: hasExpressedInterest ? 'Applied' : 'None'
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        studentInfo: {
          name: student.name,
          studentID: student.studentID,
          department: student.department
        },
        stats,
        activeProjects,
        archivedProjects,
        taskCompletionData,
        projectDistributionData,
        forumProjects: forumProjectsWithDetails
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};