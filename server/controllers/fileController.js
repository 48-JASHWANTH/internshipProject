import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import Student from '../models/studentModel.js';

// Initialize bucket as null
let bucket = null;

// Create GridFS bucket after database connection
const initializeBucket = () => {
  if (!bucket && mongoose.connection.readyState === 1) {
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    console.log('GridFS bucket initialized');
  }
};

// Initialize bucket on connection
mongoose.connection.once('open', initializeBucket);

// Also try to initialize if connection is already open
if (mongoose.connection.readyState === 1) {
  initializeBucket();
}

// Configure multer for file upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to ensure bucket is initialized
const ensureBucket = () => {
  if (!bucket) {
    initializeBucket();
  }
  return bucket;
};

// Upload file
export const uploadFile = async (req, res) => {
  try {
    const bucket = ensureBucket();
    if (!bucket) {
      return res.status(503).json({ message: 'File storage system not initialized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { studentID, projectID } = req.body;
    const filename = req.file.originalname;

    // Delete existing file if it exists
    const student = await Student.findOne({ studentID });
    if (student && student.resumeFileId) {
      try {
        await bucket.delete(new mongoose.Types.ObjectId(student.resumeFileId));
      } catch (error) {
        console.error('Error deleting existing file:', error);
      }
    }

    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        studentID,
        projectID,
        contentType: req.file.mimetype
      }
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      // Update student's resumeFileId
      await Student.findOneAndUpdate(
        { studentID },
        { resumeFileId: uploadStream.id.toString() }
      );

      res.status(201).json({ 
        message: 'File uploaded successfully',
        fileId: uploadStream.id
      });
    });

    uploadStream.on('error', (error) => {
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Get student's resume
export const getStudentResume = async (req, res) => {
  try {
    console.log('getStudentResume called with user:', req.user);
    const bucket = ensureBucket();
    if (!bucket) {
      return res.status(503).json({ message: 'File storage system not initialized' });
    }

    const studentID = req.params.studentId;
    console.log('Looking for student with ID:', studentID);
    
    const student = await Student.findOne({ studentID });
    console.log('Found student:', student);

    if (!student || !student.resumeFileId) {
      console.log('No student or resumeFileId found');
      return res.status(404).json({ message: 'No resume found for this student' });
    }

    const fileId = student.resumeFileId;
    console.log('Looking for file with ID:', fileId);
    
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    console.log('Found files:', files);
    
    if (files.length === 0) {
      console.log('No files found');
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(files[0]);
  } catch (error) {
    console.error('Error in getStudentResume:', error);
    res.status(500).json({ message: 'Error getting student resume', error: error.message });
  }
};

// Download file
export const downloadFile = async (req, res) => {
  try {
    console.log('Downloading file with ID:', req.params.fileId);
    const bucket = ensureBucket();
    if (!bucket) {
      return res.status(503).json({ message: 'File storage system not initialized' });
    }

    const fileId = req.params.fileId;
    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    // First get the file metadata
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    console.log('Found files:', files);
    
    if (files.length === 0) {
      console.log('No file found with ID:', fileId);
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    console.log('File metadata:', file);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    
    // Create download stream
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    
    // Handle stream errors
    downloadStream.on('error', (error) => {
      console.error('Error in download stream:', error);
      res.status(500).json({ message: 'Error downloading file', error: error.message });
    });

    // Pipe the file to response
    downloadStream.pipe(res);

  } catch (error) {
    console.error('Error in downloadFile:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
};

// Get file metadata
export const getFileMetadata = async (req, res) => {
  try {
    const bucket = ensureBucket();
    if (!bucket) {
      return res.status(503).json({ message: 'File storage system not initialized' });
    }

    const fileId = req.params.fileId;
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    
    if (files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    console.log(files)
    res.json(files[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error getting file metadata', error: error.message });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const bucket = ensureBucket();
    if (!bucket) {
      return res.status(503).json({ message: 'File storage system not initialized' });
    }

    const fileId = req.params.fileId;
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};
