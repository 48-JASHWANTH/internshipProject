import mongoose from "mongoose";
const InchargeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const Incharge = mongoose.model("studentsCollection", InchargeSchema);
export default Incharge
