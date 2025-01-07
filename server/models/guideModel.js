import mongoose from "mongoose";
const GuideSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const GuideModel = mongoose.model("studentsCollection", GuideSchema);
export default GuideModel 
