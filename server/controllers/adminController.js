import Admin from "../models/adminModel.js";
import Student from "../models/studentModel.js";

export const addStudents = async (req, res) => {
  try {
    const { students } = req.body; // Object with studentID: name pairs

    const createdStudents = await Promise.all(
      Object.entries(students).map(async ([studentID, name]) => {
        const mail = `${studentID.toLowerCase()}@vnrvjiet.in`;
        
        return await Student.create({
          studentID,
          name,
          mail,
          // password will use the default value from schema
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