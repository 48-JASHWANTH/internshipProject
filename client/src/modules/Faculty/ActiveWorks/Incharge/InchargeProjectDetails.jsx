import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  ChevronRight,
  Github,
  File,
  X
} from 'lucide-react';
import InchargeWorkboard from './InchargeWorkboard';
import InchargeReviews from './InchargeReviews';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

const InchargeProjectDetails = () => {
  const { projectId, classSection } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('details');
  const [abstractPdf, setAbstractPdf] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  
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

  // Fetch abstract PDF info
  useEffect(() => {
    const fetchAbstractPdf = async () => {
      if (!projectId) return;
      
      try {
        const response = await apiClient.get(`/files/project/abstract/${projectId}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          const fileInfo = response.data.fileInfo;
          setAbstractPdf({
            name: fileInfo.filename,
            url: `/files/download/${fileInfo._id}`,
            fileId: fileInfo._id
          });
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error fetching abstract PDF:', error);
        }
      }
    };

    fetchAbstractPdf();
  }, [projectId]);

  const handleDownloadAbstractPdf = async () => {
    if (abstractPdf) {
      try {
        const response = await apiClient.get(abstractPdf.url, {
          responseType: 'blob',
          withCredentials: true
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', abstractPdf.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        toast.error('Error downloading file. Please try again.');
      }
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
    <div className="max-w-7xl mx-auto px-3 py-4 sm:p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 overflow-hidden">
        <button
          onClick={() => navigate(`/Faculty/ActiveWorks/Incharge/${classSection}`)}
          className="hover:text-[#9b1a31] transition-colors flex items-center gap-1 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back 
        </button>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span className="text-gray-900 font-medium truncate">{team.projectTitle || "Untitled Project"}</span>
      </nav>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setActiveView('details')}
          className={`px-3 sm:px-4 py-2 rounded-l-md text-xs sm:text-sm font-medium transition-all ${
            activeView === 'details'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveView('workboard')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
            activeView === 'workboard'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Workboard
        </button>
        <button
          onClick={() => setActiveView('reviews')}
          className={`px-3 sm:px-4 py-2 rounded-r-md text-xs sm:text-sm font-medium transition-all ${
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
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <div className="space-y-2 flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words">{team.projectTitle || "Untitled Project"}</h1>
              <div className="flex flex-wrap gap-2 items-center">
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
            <div className="flex flex-col items-end self-end sm:self-start">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {progress}%
              </div>
              <div className="w-24 sm:w-32 bg-gray-100 rounded-full h-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Abstract PDF */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Abstract PDF</h3>
                  {abstractPdf ? (
                    <div className="space-y-2">
                      <div 
                        className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2 cursor-pointer overflow-hidden"
                        onClick={() => setShowPdfPreview(true)}
                      >
                        <File className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{abstractPdf.name}</span>
                      </div>
                      <button
                        onClick={handleDownloadAbstractPdf}
                        className="text-xs py-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Download
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not uploaded yet</p>
                  )}
                </div>

                {/* GitHub Repository */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">GitHub Repository</h3>
                  {team.githubURL ? (
                    <a
                      href={team.githubURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2 break-all"
                    >
                      <Github className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-2">View Repository</span>
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
                      className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2 break-all"
                    >
                      <File className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-2">View Drive Folder</span>
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
            <h2 className="text-xl font-semibold p-4 sm:p-6 border-b">Team & Guide</h2>
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Faculty Guide Section */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="text-base font-semibold mb-2">Faculty Guide</h3>
                <p className="text-gray-900 break-words">{team.guideFacultyId || "Not Assigned"}</p>
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
                <h3 className="text-base font-semibold mb-3 sm:mb-4">Team Members</h3>
                <div className="space-y-3">
                  {students.length > 0 ? (
                    students.map(student => (
                      <div 
                        key={student.id} 
                        className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg p-2 sm:p-3"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#9b1a31] text-white flex items-center justify-center font-medium text-sm sm:text-base flex-shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-900 font-medium truncate">{student.name}</p>
                          <p className="text-gray-600 text-sm truncate">{student.id}</p>
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
        <div className="bg-white rounded-xl shadow-sm">
          <InchargeWorkboard projectId={projectId} />
        </div>
      ) : activeView === 'reviews' ? (
        <div className="bg-white rounded-xl shadow-sm">
          <InchargeReviews projectId={projectId} />
        </div>
      ) : null}

      {/* PDF Preview Modal */}
      {showPdfPreview && abstractPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 md:p-4 border-b">
              <h3 className="text-base md:text-lg font-semibold truncate">{abstractPdf.name}</h3>
              <button 
                onClick={() => setShowPdfPreview(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="text-xl" />
              </button>
            </div>
            <div className="flex-1 p-2 md:p-4">
              <iframe
                src={`${apiClient.defaults.baseURL}${abstractPdf.url}`}
                className="w-full h-full rounded border"
                title="Abstract PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InchargeProjectDetails; 