import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  adminID: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;