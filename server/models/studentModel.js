const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
  rollno: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const StudentModel = mongoose.model("studentsCollection", StudentSchema);
module.exports = StudentModel;