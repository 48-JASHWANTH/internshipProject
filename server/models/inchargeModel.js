import mongoose from "mongoose";
const InchargeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const InchargeModel = mongoose.model("studentsCollection", InchargeSchema);
export default InchargeModel
