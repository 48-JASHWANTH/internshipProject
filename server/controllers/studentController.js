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
      const teams = await Team.find({ listOfStudents: studentID, status: false });
  
      if (!teams.length) return res.status(404).json({ message: "No pending projects found" });
  
      // Get project details
      const projectDetails = await Promise.all(
        teams.map(async team => {
          // Fetch faculty details
          const faculty = await Faculty.findOne({ facultyID: team.guideFacultyId }).select("name facultyID email");
  
          // Fetch team members' names
          const teamMembers = await Student.find({ studentID: { $in: team.listOfStudents } }).select("name studentID");
  
          // Extract all review details
          const reviewDetails = team.reviews.map(review => ({
            reviewID: review._id,
            reviewTitle: review.reviewTitle,
            reviewDescription: review.reviewDescription,
            reviewDate: review.DateOfReview,
            reviewStatus: review.reviewStatus,
            reviewerID: review.reviewerID,
            reviewerComments: review.reviewerComments,
            score: review.score
          }));
  
          return {
            projectTitle: team.projectTitle,
            projectType: team.projectType,
            status: "In Progress",
            guideFaculty: faculty ? { name: faculty.name, facultyID: faculty.facultyID, email: faculty.email } : null,
            teamMembers: teamMembers.map(member => ({ name: member.name, studentID: member.studentID })),
            reviewDetails
          };
        })
      );
  
      res.json({ projectDetails });
  
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  
  export const getStudentArchive = async (req, res) => {
    try {
      const { studentID } = req.params;
  
      // Get teams where student is a member and status is true (Completed)
      const teams = await Team.find({ listOfStudents: studentID, status: true });
  
      if (!teams.length) return res.status(404).json({ message: "No completed projects found" });
  
      // Get project details
      const projectDetails = await Promise.all(
        teams.map(async team => {
          // Fetch faculty details
          const faculty = await Faculty.findOne({ facultyID: team.guideFacultyId }).select("name facultyID email");
  
          // Fetch team members' names
          const teamMembers = await Student.find({ studentID: { $in: team.listOfStudents } }).select("name studentID");
  
          return {
            projectTitle: team.projectTitle,
            projectType: team.projectType,
            completedDate: team.completedDate || null,
            githubUrl: team.githubUrl || null,
            guideFaculty: faculty ? { name: faculty.name, facultyID: faculty.facultyID, email: faculty.email } : null,
            teamMembers: teamMembers.map(member => ({ name: member.name, studentID: member.studentID }))
          };
        })
      );
  
      res.json({ projectDetails });
  
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
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