import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const AdminModel = mongoose.model("studentsCollection", AdminSchema);
export default AdminModel
