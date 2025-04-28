import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  ChevronRight,
  Github,
  File,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import GuideWorkboard from './GuideWorkboard';
import GuideReviews from './GuideReviews';
import { apiClient } from '@/lib/api-client';
import { Dialog } from '@headlessui/react';

const GuideProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('details');
  const [abstractPdf, setAbstractPdf] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const { 
    user,
    guidedProjects,
    fetchGuidedProjects,
    isLoading,
    error
  } = useStore();

  useEffect(() => {
    const loadGuidedProjects = async () => {
      if (user?.facultyID && (!guidedProjects || !guidedProjects.teams)) {
        const result = await fetchGuidedProjects(user.facultyID);
        if (!result.success) {
          toast.error(result.error || 'Failed to load project details');
        }
      }
    };

    loadGuidedProjects();
  }, [user, fetchGuidedProjects, guidedProjects]);

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

  const project = useMemo(() => {
    if (!guidedProjects?.teams) return null;
    
    const teamData = guidedProjects.teams.find(team => team.teamId === projectId);
    if (!teamData) return null;
    
    // Calculate progress based on tasks (same formula as in InchargeProjectDetails.jsx)
    const totalTasks = teamData.tasks?.length || 0;
    const completedTasks = teamData.tasks?.filter(task => 
      task.status === 'done' || task.status === 'approved'
    ).length || 0;
    
    // Calculate progress percentage
    const progress = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    // Format team members - handle both old and new data structures
    const teamMembers = teamData.listOfStudents.map((student, index) => {
      // Check if student is already an object with id and name properties
      if (typeof student === 'object' && student !== null && 'id' in student && 'name' in student) {
        return {
          id: student.id,
          name: student.name,
        };
      } else {
        // Handle the old format where student is just an ID string
        return {
          id: student,
          name: student, // Use ID as name for backward compatibility
        };
      }
    });
    
    return {
      id: teamData.teamId,
      title: teamData.projectTitle,
      category: teamData.projectType,
      status: teamData.status ? "Completed" : "In Progress",
      startDate: format(new Date(teamData.createdAt), 'yyyy-MM-dd'),
      progress: progress, // Using the task-based progress calculation
      Abstract: teamData.projectOverview || "No project overview available.",
      facultyGuide: user?.name || "Faculty Guide",
      facultyEmail: user?.email || "",
      teamMembers,
      resources: {
        githubUrl: teamData.githubURL || null,
        driveUrl: teamData.googleDriveLink || null,
        documents: []
      },
      rawData: teamData // Keep the raw data for other components
    };
  }, [guidedProjects, projectId, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 text-[#9b1a31] animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Loading project details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error loading project</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/Faculty/ActiveWorks/Guide')}
          className="mt-4 flex items-center gap-2 text-[#9b1a31] hover:underline"
          tabIndex={0}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to projects
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-8 h-8 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Project not found</h2>
        <p className="text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/Faculty/ActiveWorks/Guide')}
          className="mt-4 flex items-center gap-2 text-[#9b1a31] hover:underline"
          tabIndex={0}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 sm:p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 overflow-hidden">
        <button
          onClick={() => navigate('/Faculty/ActiveWorks/Guide')}
          className="hover:text-[#9b1a31] transition-colors flex items-center gap-1 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back 
        </button>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span className="text-gray-900 font-medium truncate">{project.title}</span>
      </nav>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setActiveView('details')}
          className={`px-3 sm:px-4 py-2 rounded-l-md text-xs sm:text-sm font-medium transition-all ${
            activeView === 'details'
              ? 'bg-[#9b1a31] text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveView('workboard')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
            activeView === 'workboard'
              ? 'bg-[#9b1a31] text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Workboard
        </button>
        <button
          onClick={() => setActiveView('reviews')}
          className={`px-3 sm:px-4 py-2 rounded-r-md text-xs sm:text-sm font-medium transition-all ${
            activeView === 'reviews'
              ? 'bg-[#9b1a31] text-white shadow-md'
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
              <h1 className="text-2xl font-bold text-gray-900 break-words">{project.title}</h1>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 rounded-full">
                  {project.category}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  project.status === "Completed" 
                    ? "bg-green-50 text-green-700" 
                    : "bg-yellow-50 text-yellow-700"
                }`}>
                  {project.status}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.startDate}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end self-end sm:self-start">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {project.progress}%
              </div>
              <div className="w-24 sm:w-32 bg-gray-100 rounded-full h-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
                  {project.resources?.githubUrl ? (
                    <a
                      href={project.resources.githubUrl}
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
                  {project.resources?.driveUrl ? (
                    <a
                      href={project.resources.driveUrl}
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

          {/* Team & Guide */}
          <div className="bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold p-4 sm:p-6 border-b">Team Members</h2>
            <div className="p-4 sm:p-6 space-y-4">
              {project.teamMembers?.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg p-2 sm:p-3"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#9b1a31] text-white flex items-center justify-center font-medium text-sm sm:text-base flex-shrink-0">
                    {typeof member.name === 'string' ? member.name.charAt(0) : '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 font-medium truncate">{member.name}</p>
                    <p className="text-gray-600 text-sm truncate">{member.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeView === 'workboard' ? (
        <div className="bg-white rounded-xl shadow-sm">
          <GuideWorkboard projectId={projectId} project={project.rawData} />
        </div>
      ) : activeView === 'reviews' ? (
        <div className="bg-white rounded-xl shadow-sm">
          <GuideReviews projectId={projectId} project={project.rawData} />
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

export default GuideProjectDetails; 