import React, { useState, useMemo } from 'react';
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
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';

const InchargeProjectDetails = () => {
  const { projectId, classSection } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('details');
  
  // Get data from the store
  const { activeProjects } = useStore();
  
  // Find the team and section data
  const { team, sectionTeam, students, progress } = useMemo(() => {
    if (!activeProjects?.teams || !activeProjects?.sectionTeams) {
      return { team: null, sectionTeam: null, students: [], progress: 0 };
    }
    
    // Find the team
    const team = activeProjects.teams.find(t => t.teamId === projectId);
    
    // Find the section team
    const sectionTeam = activeProjects.sectionTeams.find(s => s.classID === classSection);
    
    // Get student information from the updated structure
    // The listOfStudents now contains objects with id and name properties
    const students = team?.listOfStudents || [];
    
    // Calculate progress based on tasks (same formula as in InchargeClassTeams.jsx)
    const totalTasks = team?.tasks?.length || 0;
    const completedTasks = team?.tasks?.filter(task => 
      task.status === 'done' || task.status === 'approved'
    ).length || 0;
    
    // Calculate progress percentage
    const progress = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    return { team, sectionTeam, students, progress };
  }, [activeProjects, projectId, classSection]);
  
  // Format date or provide a default
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-800">Project not found</h2>
        <button
          onClick={() => navigate(`/Faculty/ActiveWorks/Incharge/${classSection}`)}
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
        <span className="text-gray-900 font-medium">{team.projectTitle || "Untitled Project"}</span>
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
              <h1 className="text-2xl font-bold text-gray-900">{team.projectTitle || "Untitled Project"}</h1>
              <div className="flex gap-3 items-center">
                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 rounded-full">
                  {sectionTeam?.projectType || "Unknown Type"}
                </span>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  {team.status ? "Completed" : "In Progress"}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(team.createdAt)}
                </span>
              </div>
          </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {progress}%
          </div>
              <div className="w-32 bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progress}%` }}
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
                {team.projectOverview || "No project overview available."}
              </p>
      </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Abstract PDF */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Abstract PDF</h3>
                  <p className="text-sm text-gray-500">Not uploaded yet</p>
                </div>

                {/* GitHub Repository */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">GitHub Repository</h3>
                  {team.githubURL ? (
                    <a
                      href={team.githubURL}
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
                  {team.googleDriveLink ? (
                    <a
                      href={team.googleDriveLink}
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
                <p className="text-gray-900">{team.guideFacultyId || "Not Assigned"}</p>
                {team.guideFacultyId && (
                  <a 
                    href={`mailto:guide@example.com`} // Replace with actual email if available
                    className="text-[#9b1a31] text-sm hover:underline inline-flex items-center gap-1"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Guide
                  </a>
                )}
              </div>
              
              {/* Team Members Section */}
              <div>
                <h3 className="text-base font-semibold mb-4">Team Members</h3>
                <div className="space-y-3">
                  {students.length > 0 ? (
                    students.map(student => (
                      <div 
                        key={student.id} 
                        className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#9b1a31] text-white flex items-center justify-center font-medium text-base">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{student.name}</p>
                          <p className="text-gray-600 text-sm">{student.id}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No team members assigned</p>
                  )}
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