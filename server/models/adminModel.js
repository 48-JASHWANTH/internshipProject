import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin