import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'Closed': 'bg-red-100 text-red-800'
};

const ProjectForumDetails = ({ project }) => {
  const navigate = useNavigate();
  const { currentUser } = useStore();

  // Project data
  const projectData = {
    id: "IP001",
    title: "Machine Learning for Climate Analysis",
    domain: "AI/ML",
    techStack: ["Python", "TensorFlow", "MongoDB"],
    description: "Using ML algorithms to analyze climate patterns and predict environmental changes. Our project focuses on developing sophisticated machine learning models to process and analyze large-scale climate data. The system will help identify patterns, predict future climate trends, and provide valuable insights for environmental decision-making. Key features include data preprocessing, model training, pattern recognition, and visualization of climate predictions.",
    status: "Open",
    facultyName: "Dr. Robert Brown",
    facultyId: "FAC123",
    facultyEmail: "robert.brown@university.edu",
    interestExpressedOn: "2024-03-15"
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

      {/* Faculty Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Interest Status</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 text-sm">Faculty ID:</span>
              <p className="font-medium text-gray-800">{projectData.facultyId}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Faculty Name:</span>
              <p className="font-medium text-gray-800">{projectData.facultyName}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Faculty Email:</span>
              <p className="font-medium text-[#82001A]">{projectData.facultyEmail}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Interest Expressed On:</span>
              <p className="font-medium text-gray-800">
                {new Date(projectData.interestExpressedOn).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForumDetails; 