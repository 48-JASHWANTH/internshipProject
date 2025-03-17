import Student from "../models/studentModel.js";


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

  export const getStudentAcademic = async (req, res) => {
    try {
        const { studentID } = req.params;

        const student = await Student.findOne({ studentID }, {
            campus: 1, batch: 1, department: 1, degree: 1,
            tenth: 1, twelfth: 1, diploma: 1, underGraduate: 1, postGraduate: 1, _id: 0
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentAdditional = async (req, res) => {
    try {
      const student = await Student.findOne({ studentID: req.params.studentID });
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
  
  export const getStudentPersonal = async (req, res) => {
    try {
      const { studentID } = req.params;
      const student = await Student.findOne({ studentID }).select(
        "name mail phone gender dateOfBirth"
      );
  
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  

  
