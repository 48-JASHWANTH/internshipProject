import Admin from "../models/adminModel.js";
import Student from "../models/studentModel.js";
import Team from "../models/teamsModel.js";
import Faculty from "../models/facultyModel.js";

export const addStudents = async (req, res) => {
  try {
    const { students, department, batch } = req.body; // Get department and batch from request

    const createdStudents = await Promise.all(
      Object.entries(students).map(async ([studentID, name]) => {
        // Create student with ID, name, department, and batch
        return await Student.create({
          studentID,
          name,
          department, // Add department from request
          batch      // Add batch from request
        });
      })
    );

    res.status(201).json({
      success: true,
      message: `Successfully added ${createdStudents.length} students`,
      students: createdStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding students",
      error: error.message
    });
  }
};

export const softDeleteStudent = async (req, res) => {
  try {
    const { studentID } = req.params;
    //console.log(studentID);
    
    const student = await Student.findOne({ studentID });
    //console.log(student);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    
    // Perform soft delete
    await Student.findOneAndUpdate(
      { studentID },
      { 
        isActive: false,
        deletedAt: new Date()
      }
    );
    
    res.status(200).json({
      success: true,
      message: `Student ${studentID} has been deactivated`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deactivating student",
      error: error.message
    });
  }
};

export const restoreStudent = async (req, res) => {
  try {
    const { studentID } = req.params;
    
    // Bypass the middleware by using findOneAndUpdate directly with a raw query
    const student = await Student.findOneAndUpdate(
      { studentID, isActive: false },
      { 
        isActive: true,
        deletedAt: null
      },
      { new: true }
    ).lean();
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Deleted student not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Student ${studentID} has been restored`,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error restoring student",
      error: error.message
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { studentID } = req.params;
    const updates = req.body;
    
    // Fields that cannot be updated
    const restrictedFields = ['password', 'studentID', 'isActive', 'deletedAt'];
    
    // Remove restricted fields from updates
    restrictedFields.forEach(field => {
      if (updates[field] !== undefined) {
        delete updates[field];
      }
    });
    
    // Find the student
    const student = await Student.findOne({ studentID });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    
    // Update the student
    const updatedStudent = await Student.findOneAndUpdate(
      { studentID },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Student ${studentID} has been updated`,
      student: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating student",
      error: error.message
    });
  }
};

// Add a function to get all active students
export const listAllStudents = async (req, res) => {
  try {
    const students = await Student.find({})
      .sort({ studentID: 1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message
    });
  }
};

// Add a function to get a single student's details
export const getStudentDetails = async (req, res) => {
  try {
    const { studentID } = req.params;
    
    const student = await Student.findOne({ studentID });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    
    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student details",
      error: error.message
    });
  }
};

// Get inactive students
export const getInactiveStudents = async (req, res) => {
  try {
    // Use find().where() to explicitly set conditions
    const inactiveStudents = await Student.find()
      .where('isActive').equals(false)
      .select('studentID name department batch isActive')
      .lean();

    console.log('Found inactive students:', inactiveStudents);

    if (!inactiveStudents || inactiveStudents.length === 0) {
      return res.status(200).json({
        success: true,
        students: []
      });
    }

    res.status(200).json({
      success: true,
      students: inactiveStudents.map(student => ({
        studentID: student.studentID,
        name: student.name,
        department: student.department,
        batch: student.batch,
        status: 'Inactive'
      }))
    });
  } catch (error) {
    console.error('Error fetching inactive students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inactive students',
      error: error.message
    });
  }
};

// Update the getDashboardStats function with better debugging
export const getDashboardStats = async (req, res) => {
  try {
    // Get all faculty documents to check their structure
    const allFaculty = await Faculty.find().lean();
    console.log('Total faculty documents found:', allFaculty.length);
    
    if (allFaculty.length > 0) {
      // Log the first faculty document to see its structure
      console.log('Sample faculty document:', allFaculty[0]);
      
      // Check if isActive field exists and how many have it set to true
      const activeFacultyCount = allFaculty.filter(f => f.isActive === true).length;
      console.log('Faculty with isActive=true:', activeFacultyCount);
      
      // Count faculty without filtering by isActive
      const totalFacultyCount = await Faculty.countDocuments();
      console.log('Total faculty count without filters:', totalFacultyCount);
    }
    
    // Get counts from each collection - try without the isActive filter for faculty
    const studentCount = await Student.countDocuments({ isActive: true });
    const facultyCount = await Faculty.countDocuments();
    const projectCount = await Team.countDocuments();
    
    // Get active and completed projects - without filtering by status for now
    const activeProjectCount = projectCount;
    const completedProjectCount = 0;
    
    // Get pending approvals (faculty with pending status)
    const pendingApprovals = 0;
    
    // Get today's new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await Student.countDocuments({ 
      createdAt: { $gte: today },
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      stats: {
        students: studentCount,
        faculty: facultyCount,
        projects: projectCount,
        activeProjects: activeProjectCount,
        completedProjects: completedProjectCount,
        pendingApprovals: pendingApprovals,
        newUsersToday: newUsersToday
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};