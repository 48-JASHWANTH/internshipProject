import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
import facultyRoutes from "./routes/facultyRoute.js";
import studentRoutes from "./routes/studentRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import passwordResetRoutes from "./routes/passwordResetRoutes.js";
import fileRoutes from './routes/fileRoutes.js';
import forumProjectRoutes from './routes/forumProjectRoutes.js';
import commonRoutes from './routes/commonRoute.js';
// Import notification routes
import notificationRoutes from './routes/notificationRoutes.js';
console.log('Student routes:', studentRoutes);

dotenv.config()
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:5175'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Add debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/activity', activityLogRoutes);
app.use('/auth', passwordResetRoutes);
app.use('/files', fileRoutes);
app.use('/forum-projects', forumProjectRoutes); 
app.use('/common', commonRoutes);
// Add notification routes
app.use('/api/notifications', notificationRoutes);

// Add a test route to verify Express is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

const PORT = process.env.PORT || 8747

const DB_URL = process.env.DB_URL;

app.use((err, req, res, next) => {
  // Handle errors
  console.error(err);
  res.status(500).send('Something went wrong!');
}); 


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
