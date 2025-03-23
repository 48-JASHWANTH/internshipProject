import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  ChevronRight,
  Github,
  File,
} from 'lucide-react';
import InchargeWorkboard from './InchargeWorkboard';
import InchargeReviews from './InchargeReviews';

const InchargeProjectDetails = () => {
  const { projectId, classSection } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('details');

  // Mock project data - replace with actual data fetch
  const project = {
    id: projectId,
    title: "AI-Powered Healthcare Diagnostic System",
    category: "Major",
    status: "In Progress",
    startDate: "2024-01-15",
    progress: 75,
    Abstract: "A system that uses artificial intelligence to assist in medical diagnosis...",
    facultyGuide: "Dr. Sarah Johnson",
    facultyEmail: "sarah.johnson@example.com",
    teamMembers: [
      { id: 1, name: "John Doe", role: "Team Lead" },
      { id: 2, name: "Jane Smith", role: "ML Engineer" },
      { id: 3, name: "Mike Johnson", role: "Backend Developer" }
    ],
    resources: {
      abstractPdf: null,
      githubUrl: null,
      documents: []
    }
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-800">Project not found</h2>
        <button
          onClick={() => navigate('/Faculty/ActiveWorks/Incharge')}
          className="mt-4 flex items-center gap-2 text-[#9b1a31] hover:underline"
          tabIndex={0}
        >
          <ArrowLeft className="w-4 h-4" />
          Back 
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={() => navigate(`/Faculty/ActiveWorks/Incharge/${classSection}`)}
          className="hover:text-[#9b1a31] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back 
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{project.title}</span>
      </nav>

      {/* Toggle Buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => setActiveView('details')}
          className={`px-4 py-2 rounded-l-md text-sm font-medium transition-all ${
            activeView === 'details'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveView('workboard')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeView === 'workboard'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Workboard
        </button>
        <button
          onClick={() => setActiveView('reviews')}
          className={`px-4 py-2 rounded-r-md text-sm font-medium transition-all ${
            activeView === 'reviews'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Reviews
        </button>
      </div>
      
      {/* Project Header */}
      {activeView === 'details' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <div className="flex gap-3 items-center">
                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 rounded-full">
                  {project.category}
                </span>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  {project.status}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.startDate}
                </span>
              </div>
          </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {project.progress}%
          </div>
              <div className="w-32 bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
          </div>
          </div>
        </div>
        </div>
      )}

      {activeView === 'details' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project Overview */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                {project.Abstract}
              </p>
      </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Abstract PDF */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Abstract PDF</h3>
                  {project.resources?.abstractPdf ? (
                    <a
                      href={project.resources.abstractPdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2"
                    >
                      <File className="w-4 h-4" />
                      View Abstract
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not uploaded yet</p>
                  )}
      </div>

                {/* GitHub Repository */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">GitHub Repository</h3>
                  {project.resources?.githubUrl ? (
                    <a
                      href={project.resources.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      View Repository
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not linked yet</p>
                  )}
                </div>
                {/* Google Drive Link */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Google Drive</h3>
                  {project.resources?.driveUrl ? (
                    <a
                      href={project.resources.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2"
                    >
                      <File className="w-4 h-4" />
                      View Drive Folder
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not linked yet</p>
                  )}
                </div>
              </div>
            </div>
        </div>

          {/* Updated Team & Guide Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold p-6 border-b">Team & Guide</h2>
            <div className="p-6 space-y-8">
              {/* Faculty Guide Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold mb-2">Faculty Guide</h3>
                <p className="text-gray-900">{project.facultyGuide}</p>
                <a 
                  href={`mailto:${project.facultyEmail}`}
                  className="text-[#9b1a31] text-sm hover:underline inline-flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  Contact Guide
                </a>
              </div>
              
              {/* Team Members Section */}
              <div>
                <h3 className="text-base font-semibold mb-4">Team Members</h3>
                <div className="space-y-3">
                  {project.teamMembers?.map(member => (
                    <div 
                      key={member.id} 
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#9b1a31] text-white flex items-center justify-center font-medium text-base">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{member.name}</p>
                        <p className="text-gray-600 text-sm">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeView === 'workboard' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <InchargeWorkboard projectId={projectId} />
        </div>
      ) : activeView === 'reviews' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <InchargeReviews projectId={projectId} />
        </div>
      ) : null}
    </div>
  );
};

export default InchargeProjectDetails; 