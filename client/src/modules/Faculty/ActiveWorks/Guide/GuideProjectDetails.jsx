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
  Loader
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import GuideWorkboard from './GuideWorkboard';
import GuideReviews from './GuideReviews';

const GuideProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('details');

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
        abstractPdf: null, // These would need to be populated from actual data
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={() => navigate('/Faculty/ActiveWorks/Guide')}
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
              ? 'bg-[#9b1a31] text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveView('workboard')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeView === 'workboard'
              ? 'bg-[#9b1a31] text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Workboard
        </button>
        <button
          onClick={() => setActiveView('reviews')}
          className={`px-4 py-2 rounded-r-md text-sm font-medium transition-all ${
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
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <div className="flex gap-3 items-center flex-wrap">
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

          {/* Team & Guide */}
          <div className="bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold p-6 border-b">Team Members</h2>
            <div className="p-6 space-y-4">
              {project.teamMembers?.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <div className="w-10 h-10 rounded-full bg-[#9b1a31] text-white flex items-center justify-center font-medium text-base">
                    {typeof member.name === 'string' ? member.name.charAt(0) : '?'}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{member.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeView === 'workboard' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <GuideWorkboard projectId={projectId} project={project.rawData} />
        </div>
      ) : activeView === 'reviews' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <GuideReviews projectId={projectId} project={project.rawData} />
        </div>
      ) : null}
    </div>
  );
};

export default GuideProjectDetails; 