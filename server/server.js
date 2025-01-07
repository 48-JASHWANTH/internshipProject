import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
dotenv.config()
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173","http://localhost:5174"],
};
app.use(cors(corsOptions));

app.use(cookieParser())
app.use(express.json())


const PORT = 1544;

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
