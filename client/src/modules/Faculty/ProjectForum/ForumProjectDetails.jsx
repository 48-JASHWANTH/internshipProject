import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'Closed': 'bg-red-100 text-red-800'
};

// Mock data for student responses
const studentResponses = [
  {
    rollNo: "20CS01",
    name: "John Doe",
    email: "john.doe@university.edu",
    dateApplied: "2024-03-15"
  },
  {
    rollNo: "20CS02",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    dateApplied: "2024-03-16"
  }
];

const ForumProjectDetails = ({ project }) => {
  const navigate = useNavigate();

  // Mock project data (replace with actual data from your route/props)
  const projectData = {
    id: 1,
    title: "AI-Powered Healthcare System",
    domain: "AI/ML",
    techStack: ["Python", "TensorFlow", "React", "Node.js"],
    description: "Developing an intelligent system for early disease detection using machine learning algorithms. The system will utilize advanced machine learning techniques to analyze medical data and predict potential health risks. Key features include real-time health monitoring, predictive analytics, and integration with existing healthcare systems.",
    status: "Open",
    facultyName: "Dr. Sarah Johnson"
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-black">Project Details</h1>
      </div>

      {/* Project Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-6">
          {/* Title and Status */}
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-black">{projectData.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[projectData.status]}`}>
              {projectData.status}
            </span>
          </div>

          {/* Domain */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Domain</h3>
            <p className="text-gray-800">{projectData.domain}</p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{projectData.description}</p>
          </div>
        </div>
      </div>

      {/* Student Responses Section - Updated for more compact design */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Student Responses</h2>
        
        {studentResponses.length > 0 ? (
          <div className="space-y-2">
            {studentResponses.map((student) => (
              <div 
                key={student.rollNo}
                className="border rounded-lg p-3 hover:border-[#82001A] transition-colors"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-8">
                    <div>
                      <span className="text-gray-600">Roll No: </span>
                      <span className="font-medium">{student.rollNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Name: </span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-600">Email: </span>
                      <span className="font-medium text-[#82001A]">{student.email}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(student.dateApplied).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No responses received yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumProjectDetails; 