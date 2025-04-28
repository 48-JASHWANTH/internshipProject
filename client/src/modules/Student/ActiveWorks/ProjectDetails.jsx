import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  ChevronRight,
  Github,
  File,
  Edit2,
  X,
  Trash2
} from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Workboard from './Workboard';
import ReviewBoard from './ReviewBoard';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { useStore } from '@/store/useStore';


// Helper function to calculate progress
const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => 
    task.status === 'done' || task.status === 'approved'
  ).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('details');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [projectOverview, setProjectOverview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [abstractPdf, setAbstractPdf] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const { user } = useStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details directly from API
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!user?.studentID || !projectId) return;
      
      try {
        setLoading(true);
        const response = await apiClient.get(`/student/activeworks/${user.studentID}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          const projectData = response.data.activeProjects.find(p => p.teamId === projectId);
          if (projectData) {
            setProject(projectData);
            setGithubUrl(projectData.projectDetails.githubURL || '');
            setDriveUrl(projectData.projectDetails.googleDriveLink || '');
            setProjectOverview(projectData.projectDetails.projectOverview || '');
            fetchAbstractPdf();
          } else {
            setError('Project not found');
          }
        } else {
          setError('Failed to fetch project details');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [user?.studentID, projectId]);

  // Fetch abstract PDF info
  const fetchAbstractPdf = async () => {
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

  const handleGithubUrlSubmit = async () => {
    if (!githubUrl.trim()) {
      toast.error('Please enter a valid GitHub URL');
      return;
    }
    try {
      const response = await apiClient.put(
        `/student/project/github/${projectId}`,
        { githubURL: githubUrl },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsGithubModalOpen(false);
        toast.success('GitHub repository linked successfully');
        // Update local state
        setProject(prev => ({
          ...prev,
          projectDetails: {
            ...prev.projectDetails,
            githubURL: githubUrl
          }
        }));
      }
    } catch (error) {
      console.error('Error updating GitHub URL:', error);
      toast.error(error.response?.data?.message || 'Failed to update GitHub URL');
    }
  };

  const handleDriveUrlSubmit = async () => {
    if (!driveUrl.trim()) {
      toast.error('Please enter a valid Google Drive URL');
      return;
    }
    try {
      const response = await apiClient.put(
        `/student/project/drive/${projectId}`,
        { googleDriveLink: driveUrl },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsDriveModalOpen(false);
        toast.success('Google Drive linked successfully');
        // Update local state
        setProject(prev => ({
          ...prev,
          projectDetails: {
            ...prev.projectDetails,
            googleDriveLink: driveUrl
          }
        }));
      }
    } catch (error) {
      console.error('Error updating Drive URL:', error);
      toast.error(error.response?.data?.message || 'Failed to update Drive URL');
    }
  };

  const handleOverviewSave = async () => {
    try {
      const response = await apiClient.put(
        `/student/project/overview/${projectId}`,
        { projectOverview },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsEditingOverview(false);
        toast.success('Project overview updated successfully');
        // Update local state
        setProject(prev => ({
          ...prev,
          projectDetails: {
            ...prev.projectDetails,
            projectOverview
          }
        }));
      }
    } catch (error) {
      console.error('Error updating project overview:', error);
      toast.error(error.response?.data?.message || 'Failed to update project overview');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('teamId', projectId);

      const response = await apiClient.post(
        '/files/project/abstract',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success('Abstract PDF uploaded successfully');
        // Refresh the abstract PDF info
        fetchAbstractPdf();
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAbstractPdf = async () => {
    if (!abstractPdf || !abstractPdf.fileId) return;

    try {
      const response = await apiClient.delete(
        `/files/${abstractPdf.fileId}`,
        { withCredentials: true }
      );

      if (response.data.message) {
        setAbstractPdf(null);
        toast.success('Abstract PDF removed successfully');
      }
    } catch (error) {
      console.error('Error removing abstract PDF:', error);
      toast.error('Failed to remove PDF');
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-800">{error || 'Project not found'}</h2>
        <button
          onClick={() => navigate('/Student/ActiveWorks')}
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
          onClick={() => navigate('/Student/ActiveWorks')}
          className="hover:text-[#9b1a31] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back 
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{project?.projectDetails?.projectTitle || 'Loading...'}</span>
      </nav>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-1">
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
          } ${activeView === 'details' ? 'rounded-tl-none rounded-bl-none' : ''} ${activeView === 'reviews' ? 'rounded-tr-none rounded-br-none' : ''}`}
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
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
            <div className="space-y-2 w-full sm:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">{project?.projectDetails?.projectTitle || 'Loading...'}</h1>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 rounded-full">
                  {project?.projectDetails?.projectType || 'Unknown Type'}
                </span>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  {project?.projectDetails?.projectStatus || 'In Progress'}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project?.projectDetails?.startDate ? new Date(project.projectDetails.startDate).toLocaleDateString() : 'No date'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end self-stretch sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {calculateProgress(project?.workDetails?.tasks || [])}%
              </div>
              <div className="w-full sm:w-32 bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                  style={{ width: `${calculateProgress(project?.workDetails?.tasks || [])}%` }}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
                {isEditingOverview ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleOverviewSave}
                      className="text-green-600 hover:text-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingOverview(false)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setProjectOverview(project.projectDetails.projectOverview || '');
                      setIsEditingOverview(true);
                    }}
                    className="text-gray-600 hover:text-[#9b1a31]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isEditingOverview ? (
                <textarea
                  value={projectOverview}
                  onChange={(e) => setProjectOverview(e.target.value)}
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
                  placeholder="Enter project overview..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {project.projectDetails.projectOverview || "No overview available"}
                </p>
              )}
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
                        className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2 cursor-pointer truncate"
                        onClick={() => setShowPdfPreview(true)}
                      >
                        <File className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{abstractPdf.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadAbstractPdf}
                          className="text-xs py-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Download
                        </button>
                        <button
                          onClick={handleDeleteAbstractPdf}
                          className="text-xs py-1 px-2 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="abstractPdf"
                      />
                      <label
                        htmlFor="abstractPdf"
                        className="cursor-pointer block w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#9b1a31] hover:text-[#9b1a31] transition-colors text-center text-sm"
                      >
                        {isUploading ? 'Uploading...' : 'Upload Abstract PDF'}
                      </label>
                    </div>
                  )}
                </div>

                {/* GitHub Repository */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">GitHub Repository</h3>
                  {project.projectDetails.githubURL ? (
                    <div className="space-y-2">
                      <a
                        href={project.projectDetails.githubURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2 truncate"
                      >
                        <Github className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">View Repository</span>
                      </a>
                      <button
                        onClick={() => setIsGithubModalOpen(true)}
                        className="text-xs py-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsGithubModalOpen(true)}
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#9b1a31] hover:text-[#9b1a31] transition-colors text-sm"
                    >
                      Add GitHub Repository
                    </button>
                  )}
                </div>

                {/* Google Drive Link */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Google Drive</h3>
                  {project.projectDetails.googleDriveLink ? (
                    <div className="space-y-2">
                      <a
                        href={project.projectDetails.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#9b1a31] hover:underline flex items-center gap-2 truncate"
                      >
                        <File className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">View Drive Folder</span>
                      </a>
                      <button
                        onClick={() => setIsDriveModalOpen(true)}
                        className="text-xs py-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsDriveModalOpen(true)}
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#9b1a31] hover:text-[#9b1a31] transition-colors text-sm"
                    >
                      Add Drive Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team & Guide */}
          <div className="bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold p-6 border-b">Team & Guide</h2>
            <div className="p-6 space-y-8">
              {/* Faculty Guide Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold mb-2">Faculty Guide</h3>
                <p className="text-gray-900">{project.facultyDetails.guide?.name || "Not Assigned"}</p>
                <a 
                  href={`mailto:${project.facultyDetails.guide?.email || ""}`}
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
                  {project.teamDetails.members.map(member => (
                    <div 
                      key={member.studentID} 
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#9b1a31] text-white flex items-center justify-center font-medium text-base">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{member.name}</p>
                        <p className="text-gray-600 text-sm">{member.studentID}</p>
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
          <Workboard projectId={projectId} />
        </div>
      ) : activeView === 'reviews' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ReviewBoard projectId={projectId} />
        </div>
      ) : null}

      {/* GitHub URL Modal */}
      <Dialog
        open={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Add GitHub Repository
            </Dialog.Title>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsGithubModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleGithubUrlSubmit}
                className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#7d1527] transition-colors"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Google Drive URL Modal */}
      <Dialog
        open={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Add Google Drive Link
            </Dialog.Title>
            <input
              type="url"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDriveModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDriveUrlSubmit}
                className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#7d1527] transition-colors"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* PDF Preview Modal */}
      {showPdfPreview && abstractPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-lg w-full h-full md:max-w-4xl md:max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-3 md:p-4 border-b">
              <h3 className="text-base md:text-lg font-semibold truncate flex-1 pr-2">{abstractPdf.name}</h3>
              <button 
                onClick={() => setShowPdfPreview(false)}
                className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-2 md:p-4 overflow-hidden">
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

export default ProjectDetails; 