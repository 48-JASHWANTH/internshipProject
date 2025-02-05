import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
import guideRoutes from "./routes/guideRoutes.js"
import inchargeRoutes from "./routes/inchargeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
dotenv.config()
const app = express();

const corsOptions = {
  origin: process.env.ORIGIN,

};
app.use(cors(corsOptions));

app.use(cookieParser())
app.use(express.json())

app.use('/admin',adminRoutes)
app.use('/guide',guideRoutes) 
app.use('/incharge',inchargeRoutes)
app.use('/student',studentRoutes)


const PORT = process.env.PORT || 8747

const DB_URL = process.env.DB_URL; 
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Database connection successful!!!');
  })
  .catch((err) => {
    console.error('Error while connecting to MongoDB:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
