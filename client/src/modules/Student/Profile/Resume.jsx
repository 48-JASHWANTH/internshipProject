import { useState, useCallback, useEffect } from 'react';
import { FaFileUpload, FaFileDownload, FaFilePdf, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useStore } from '@/store/useStore';


const Resume = () => {
  const [resume, setResume] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useStore();
  const studentID = user.studentID;

  // Fetch student's resume on component mount
  useEffect(() => {
    fetchStudentResume();
  }, []);

  const fetchStudentResume = async () => {
    try {
      const response = await axios.get(`http://localhost:1544/files/resume/${studentID}`, {
        withCredentials: true
      });
      if (response.data) {
        setResume({
          name: response.data.filename,
          url: `http://localhost:1544/files/download/${response.data._id}`,
          fileId: response.data._id
        });
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      if (error.response?.status === 404) {
        setResume(null);
      }
    }
  };

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setResume(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('studentID', studentID);
      formData.append('projectID', 'RESUME');

      const response = await axios.post('http://localhost:1544/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      if (response.data.fileId) {
        // Fetch the updated resume
        await fetchStudentResume();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
      await uploadFile(file);
    }
  }, []);

  const handleDownload = async () => {
    if (resume) {
      try {
        const response = await axios.get(`http://localhost:1544/files/download/${resume.fileId}`, {
          responseType: 'blob',
          withCredentials: true
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', resume.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file. Please try again.');
      }
    }
  };

  const handlePreview = () => {
    if (resume) {
      setShowPreview(true);
    }
  };

  return (
    <div className="mt-4 p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Resume Management</h2>
      
      <div 
        className={`bg-gray-50 rounded-lg p-6 md:p-8 text-center transition-all duration-200
          ${!resume ? 'border-2 border-dashed' : ''}
          ${isDragging ? 'border-[#82001A] bg-red-50' : 'border-gray-300'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!resume ? (
          <div className="space-y-4">
            <FaFileUpload 
              className={`mx-auto text-3xl md:text-4xl ${isDragging ? 'text-[#82001A]' : 'text-gray-400'}`}
            />
            <div className="space-y-2">
              <p className="text-sm md:text-base text-gray-600">
                {isDragging 
                  ? 'Drop your PDF file here' 
                  : 'Drag & drop your resume or click to upload'
                }
              </p>
              <p className="text-xs md:text-sm text-gray-500">Only PDF files are accepted</p>
            </div>
            <div className="flex justify-center">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#82001A] file:text-white
                    hover:file:bg-red-800
                    cursor-pointer"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              className="flex items-center justify-center space-x-2 text-gray-700 cursor-pointer hover:text-[#82001A] transition-colors duration-200"
              onClick={handlePreview}
            >
              <FaFilePdf className="text-xl md:text-2xl text-[#82001A]" />
              <span className="font-medium text-sm md:text-base">{resume.name}</span>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 
                  flex items-center space-x-2 transition-colors duration-200 text-sm md:text-base"
              >
                <FaFileUpload />
                <span>Upload New</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="px-3 md:px-4 py-2 bg-[#82001A] text-white rounded-full hover:bg-red-800 
                  flex items-center space-x-2 transition-colors duration-200 text-sm md:text-base"
              >
                <FaFileDownload />
                <span>Download</span>
              </button>
            </div>
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 md:p-4 border-b">
              <h3 className="text-base md:text-lg font-semibold truncate">{resume.name}</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="flex-1 p-2 md:p-4">
              <iframe
                src={resume.url}
                className="w-full h-full rounded border"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;
