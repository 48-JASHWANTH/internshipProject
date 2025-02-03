import mongoose from "mongoose";
const GuideSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const Guide = mongoose.model("Guide", GuideSchema);
export default Guide 
