import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { 
  deleteFile, 
  downloadFile, 
  getFileMetadata, 
  uploadFile, 
  upload, 
  getStudentResume,
  uploadProjectAbstractPdf,
  getProjectAbstractPdf
} from '../controllers/fileController.js';

const fileRoutes = Router();

// File upload route with multer middleware
fileRoutes.post('/upload', verifyToken, upload.single('pdf'), uploadFile);

// Project abstract PDF routes
fileRoutes.post('/project/abstract', verifyToken, upload.single('pdf'), uploadProjectAbstractPdf);
fileRoutes.get('/project/abstract/:teamId', verifyToken, getProjectAbstractPdf);

// Get student's resume
fileRoutes.get('/resume/:studentId', verifyToken, getStudentResume);

// File download route
fileRoutes.get('/download/:fileId', verifyToken, downloadFile);

// Get file metadata
// fileRoutes.get('/metadata/:fileId', verifyToken, getFileMetadata);

// Get latest resume for the authenticated student
// fileRoutes.get('/metadata/latest', verifyToken, getLatestResume);

// Delete file
fileRoutes.delete('/:fileId', verifyToken, deleteFile);

export default fileRoutes; 