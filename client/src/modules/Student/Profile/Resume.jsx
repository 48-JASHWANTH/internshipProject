import { useState, useCallback } from 'react';
import { FaFileUpload, FaFileDownload, FaFilePdf, FaTimes } from 'react-icons/fa';

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setResume(file);
    } else {
      alert('Please upload a PDF file');
    }
  };
  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    handleFile(file);
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

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleDownload = () => {
    if (resume) {
      const fileURL = URL.createObjectURL(resume);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = resume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    }
  };

  const handlePreview = () => {
    if (resume) {
      setShowPreview(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Resume Management</h2>
      
      <div 
        className={`
          bg-gray-50 rounded-lg p-8 text-center
          ${!resume ? 'border-2 border-dashed transition-colors duration-200' : ''}
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
              className={`mx-auto text-4xl ${isDragging ? 'text-[#82001A]' : 'text-gray-400'}`}
            />
            <div className="space-y-2">
              <p className="text-gray-600">
                {isDragging 
                  ? 'Drop your PDF file here' 
                  : 'Drag & drop your resume or click to upload'
                }
              </p>
              <p className="text-sm text-gray-500">Only PDF files are accepted</p>
            </div>
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
        ) : (
          <div className="space-y-4">
            <div 
              className="flex items-center justify-center space-x-2 text-gray-700 cursor-pointer hover:text-[#82001A] transition-colors duration-200"
              onClick={handlePreview}
            >
              <FaFilePdf className="text-2xl text-[#82001A]" />
              <span className="font-medium">{resume.name}</span>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 
                  flex items-center space-x-2 transition-colors duration-200"
              >
                <FaFileUpload />
                <span>Upload New</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[#82001A] text-white rounded-full hover:bg-red-800 
                  flex items-center space-x-2 transition-colors duration-200"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{resume.name}</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={URL.createObjectURL(resume)}
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
