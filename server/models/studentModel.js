import mongoose from "mongoose";
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

const Student = mongoose.model("studentsCollection", StudentSchema);
export default Student
