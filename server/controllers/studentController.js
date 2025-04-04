import Student from "../models/studentModel.js";
import Team from "../models/teamsModel.js";
import Faculty from "../models/facultyModel.js";
import SectionTeams from "../models/sectionTeamsModel.js";

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
            (review.assignedBy?.type === 'Guide' && !review.assignedBy?.facultyID)
          );
          
          const matchedInchargeReviews = team.reviews.filter(review => 
            review.assignedBy?.facultyID === team.inchargefacultyId || 
            (review.assignedBy?.type === 'Incharge' && !review.assignedBy?.facultyID)
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
          
          // Any remaining unmatched reviews that couldn't be categorized go to incharge
          const reallyUnmatched = unmatchedReviews.filter(r => 
            !additionalGuideReviews.includes(r) && !additionalInchargeReviews.includes(r)
          );
          
          if (reallyUnmatched.length > 0) {
            console.log(`Adding ${reallyUnmatched.length} uncategorized reviews to incharge reviews`);
            inchargeReviews.push(...reallyUnmatched);
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
  
      // Get student details first to get department
      const student = await Student.findOne({ studentID }).select("department");
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
  
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
          message: "No completed projects found" 
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
          const guideReviews = team.reviews.filter(
            review => review.assignedBy?.facultyID === team.guideFacultyId
          ).sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
  
          const inchargeReviews = team.reviews.filter(
            review => review.assignedBy?.facultyID === team.inchargefacultyId
          ).sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
  
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
              department: student.department
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
        dateOfBirth: student.dateOfBirth
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
      (review.assignedBy?.type === 'Guide' && !review.assignedBy?.facultyID)
    );
    
    const matchedInchargeReviews = team.reviews.filter(review => 
      review.assignedBy?.facultyID === team.inchargefacultyId || 
      (review.assignedBy?.type === 'Incharge' && !review.assignedBy?.facultyID)
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
    
    // Any remaining unmatched reviews that couldn't be categorized go to incharge
    const reallyUnmatched = unmatchedReviews.filter(r => 
      !additionalGuideReviews.includes(r) && !additionalInchargeReviews.includes(r)
    );
    
    if (reallyUnmatched.length > 0) {
      console.log(`Adding ${reallyUnmatched.length} uncategorized reviews to incharge reviews`);
      inchargeReviews.push(...reallyUnmatched);
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
    console.error('Error fetching team reviews:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
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