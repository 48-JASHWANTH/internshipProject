import Admin from "../models/adminModel.js";
import Student from "../models/studentModel.js";

export const addStudents = async (req, res) => {
  try {
    const { students } = req.body; // Object with studentID: name pairs

    const createdStudents = await Promise.all(
      Object.entries(students).map(async ([studentID, name]) => {
        // Create student with just ID and name
        // All other fields will use their default values
        return await Student.create({
          studentID,
          name
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