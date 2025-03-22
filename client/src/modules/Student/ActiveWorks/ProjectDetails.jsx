import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  ChevronRight,
  Github,
  File,
} from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Workboard from './Workboard';
import { toast } from 'react-hot-toast';
import ReviewBoard from './ReviewBoard';
import { useStore } from '@/store/useStore';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, updateProjectResource } = useStore();
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [activeView, setActiveView] = useState('details');
  const [isUploading, setIsUploading] = useState(false);
  
  const project = useMemo(() => 
    projects.find(work => work.id === projectId),
    [projects, projectId]
  );

  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'abstractPdf' ? '.pdf' : '*/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);
      
      // Create a mock file URL and update the state
      const fileUrl = URL.createObjectURL(file);
      const uploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        url: fileUrl,
        type: type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      // Update project resources
      updateProjectResource(projectId, type, uploadedFile);
      
      console.log('Resource updated:', {
        type,
        file: uploadedFile
      });

      setIsUploading(false);
    };

    input.click();
  };

  const handleRemoveResource = (type) => {
    updateProjectResource(projectId, type, null);
    console.log('Resource removed:', type);
  };

  const handleGithubUrlSubmit = () => {
    updateProjectResource(projectId, 'githubUrl', githubUrl);
    setIsGithubModalOpen(false);
    console.log('GitHub URL updated:', githubUrl);
  };

  const handleDocumentDelete = async (documentId) => {
    try {
      await resourceService.deleteDocument(projectId, documentId);
      updateProject(projectId, {
        ...project,
        resources: {
          ...project.resources,
          documents: project.resources.documents.filter(doc => doc.id !== documentId)
        }
      });
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Error deleting document');
    }
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-800">Project not found</h2>
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
                  In Progress
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
            <h1 className="text-lg font-semibold text-gray-900 mb-4"> <span className="font-semibold">Project Overview</span></h1>
              <p className="text-gray-600 leading-relaxed">
                {project.Abstract}
              </p>
            </div>
            
            {/* Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Abstract PDF</h3>
                  {project.resources?.abstractPdf ? (
                    <div className="space-y-2">
                      <a
                        href={project.resources.abstractPdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-yellow-600 hover:underline flex items-center gap-2"
                      >
                        <File className="w-4 h-4" />
                        {project.resources.abstractPdf.name}
                      </a>
                      <button
                        onClick={() => handleRemoveResource('abstractPdf')}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFileUpload('abstractPdf')}
                      disabled={isUploading}
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#9b1a31] hover:text-[#9b1a31] transition-colors flex items-center justify-center gap-2"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Abstract PDF'}
                    </button>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">GitHub Repository</h3>
                  {project.resources?.githubUrl ? (
                    <div className="space-y-2">
                      <a
                        href={project.resources.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-yellow-600 hover:underline flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        View Repository
                      </a>
                      <button
                        onClick={() => handleRemoveResource('githubUrl')}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsGithubModalOpen(true)}
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#9b1a31] hover:text-[#9b1a31] transition-colors flex items-center justify-center gap-2"
                    >
                      Add GitHub Repository
                    </button>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Additional Documents</h3>
                  {project.resources?.documents?.length > 0 ? (
                    <div className="space-y-2">
                      {project.resources.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-yellow-600 hover:underline flex items-center gap-2"
                          >
                            <File className="w-4 h-4" />
                            {doc.name}
                          </a>
                          <button
                            onClick={() => handleDocumentDelete(doc.id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <button
                    onClick={() => handleFileUpload('document')}
                    disabled={isUploading}
                    className="w-full mt-2 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#9b1a31] hover:text-[#9b1a31] transition-colors flex items-center justify-center gap-2"
                  >
                    {isUploading ? 'Uploading...' : 'Add Document'}
                  </button>
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
                <p className="text-gray-900 ">{project.facultyGuide}</p>
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
          <Workboard 
            projectId={projectId}
          />
        </div>
      ) : activeView === 'reviews' ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ReviewBoard 
            projectId={projectId}
          />
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
    </div>
  );
};

export default ProjectDetails; 