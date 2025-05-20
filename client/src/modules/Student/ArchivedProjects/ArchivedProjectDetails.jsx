import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaGoogleDrive, FaUsers, FaClipboardCheck, FaArrowLeft, FaPen, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { Calendar, CheckCircle, Save } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

const satisfactionColors = {
  'Excellent': 'bg-purple-100 text-purple-800',
  'Very Good': 'bg-blue-100 text-blue-800', 
  'Good': 'bg-yellow-100 text-yellow-800',
  'Fair': 'bg-orange-100 text-orange-800',
  'Poor': 'bg-red-100 text-red-800'
};

const ArchivedProjectDetails = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Add loading state for outcomes data
  const [outcomesLoading, setOutcomesLoading] = useState(false);
  
  // Edit states
  const [editMode, setEditMode] = useState({
    techStack: false,
    objectives: false,
    outcomes: false
  });
  
  // Form data states
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [objectiveInput, setObjectiveInput] = useState('');
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeInput, setOutcomeInput] = useState('');

  // Get archived projects and fetch function from store
  const { archivedProjects, loading, error, fetchArchivedProjects, user } = useStore();

  // Fetch archived projects on component mount
  useEffect(() => {
    if (user?.studentID && !archivedProjects) {
      fetchArchivedProjects(user.studentID);
    }
  }, [user?.studentID, fetchArchivedProjects, archivedProjects]);

  // Find the current project
  const project = useMemo(() => {
    if (!archivedProjects) return null;
    return archivedProjects.find(p => p.teamId === projectId);
  }, [archivedProjects, projectId]);

  // Function to fetch project outcomes directly
  const fetchProjectOutcomes = async () => {
    if (!projectId) return;
    
    setOutcomesLoading(true);
    try {
      const response = await apiClient.get(`/student/project/outcomes/${projectId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const { techStack: fetchedTechStack, objectives: fetchedObjectives, outcomes: fetchedOutcomes } = response.data.data;
        setTechStack(fetchedTechStack || []);
        setObjectives(fetchedObjectives || []);
        setOutcomes(fetchedOutcomes || []);
      }
    } catch (error) {
      console.error('Error fetching project outcomes:', error);
      toast.error('Failed to load project details');
    } finally {
      setOutcomesLoading(false);
    }
  };

  // Fetch outcomes data when project ID changes or when switching to outcomes tab
  useEffect(() => {
    if (projectId && (activeTab === 'outcomes' || activeTab === 'overview')) {
      fetchProjectOutcomes();
    }
  }, [projectId, activeTab]);

  // Initialize form data when project loads - fallback to project data if direct fetch fails
  useEffect(() => {
    if (project) {
      setTechStack(prev => prev.length > 0 ? prev : (project.projectDetails.techStack || []));
      setObjectives(prev => prev.length > 0 ? prev : (project.projectDetails.objectives || []));
      setOutcomes(prev => prev.length > 0 ? prev : (project.projectDetails.outcomes || []));
    }
  }, [project]);

  // Handle adding a new technology
  const handleAddTech = () => {
    if (techInput.trim()) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  // Handle removing a technology
  const handleRemoveTech = (index) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  // Handle adding a new objective
  const handleAddObjective = () => {
    if (objectiveInput.trim()) {
      setObjectives([...objectives, objectiveInput.trim()]);
      setObjectiveInput('');
    }
  };

  // Handle removing an objective
  const handleRemoveObjective = (index) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  // Handle adding a new outcome
  const handleAddOutcome = () => {
    if (outcomeInput.trim()) {
      setOutcomes([...outcomes, outcomeInput.trim()]);
      setOutcomeInput('');
    }
  };

  // Handle removing an outcome
  const handleRemoveOutcome = (index) => {
    setOutcomes(outcomes.filter((_, i) => i !== index));
  };

  // Handle saving tech stack changes
  const handleSaveTechStack = async () => {
    console.log("techStack", techStack);
    try {
      const response = await apiClient.put(`/student/project/outcomes/${projectId}`, {
        techStack
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Tech stack updated successfully');
        setEditMode({...editMode, techStack: false});
        // Refresh project data - using both methods
        fetchProjectOutcomes();
        if (user?.studentID) {
          fetchArchivedProjects(user.studentID);
        }
      }
    } catch (error) {
      console.error('Error updating tech stack:', error);
      toast.error('Failed to update tech stack');
    }
  };

  // Handle saving objectives changes
  const handleSaveObjectives = async () => {
    try {
      const response = await apiClient.put(`/student/project/outcomes/${projectId}`, {
        objectives
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Objectives updated successfully');
        setEditMode({...editMode, objectives: false});
        // Refresh project data - using both methods
        fetchProjectOutcomes();
        if (user?.studentID) {
          fetchArchivedProjects(user.studentID);
        }
      }
    } catch (error) {
      console.error('Error updating objectives:', error);
      toast.error('Failed to update objectives');
    }
  };

  // Handle saving outcomes changes
  const handleSaveOutcomes = async () => {
    try {
      const response = await apiClient.put(`/student/project/outcomes/${projectId}`, {
        outcomes
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Outcomes updated successfully');
        setEditMode({...editMode, outcomes: false});
        // Refresh project data - using both methods
        fetchProjectOutcomes(); 
        if (user?.studentID) {
          fetchArchivedProjects(user.studentID);
        }
      }
    } catch (error) {
      console.error('Error updating outcomes:', error);
      toast.error('Failed to update outcomes');
    }
  };

  // Cancel edit mode and reset form values from project
  const handleCancelEdit = (field) => {
    if (field === 'techStack') {
      setTechStack(project.projectDetails.techStack || []);
    } else if (field === 'objectives') {
      setObjectives(project.projectDetails.objectives || []);
    } else if (field === 'outcomes') {
      setOutcomes(project.projectDetails.outcomes || []);
    }
    setEditMode({...editMode, [field]: false});
  };

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-yellow-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  // Add new function for deleting individual items
  const handleDeleteItem = async (type, index) => {
    if (!confirm(`Are you sure you want to delete this ${type === 'techStack' ? 'technology' : type === 'objectives' ? 'objective' : 'outcome'}?`)) {
      return;
    }
    
    setOutcomesLoading(true);
    try {
      const response = await apiClient.delete(`/student/project/outcomes/${projectId}/${type}/${index}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success(`${type === 'techStack' ? 'Technology' : type === 'objectives' ? 'Objective' : 'Outcome'} deleted successfully`);
        
        // Update local state based on the response
        if (type === 'techStack') {
          setTechStack(response.data.data.techStack);
        } else if (type === 'objectives') {
          setObjectives(response.data.data.objectives);
        } else if (type === 'outcomes') {
          setOutcomes(response.data.data.outcomes);
        }
        
        // Refresh all project data
        if (user?.studentID) {
          fetchArchivedProjects(user.studentID);
        }
      }
    } catch (error) {
      console.error(`Error deleting ${type} item:`, error);
      toast.error(`Failed to delete ${type === 'techStack' ? 'technology' : type === 'objectives' ? 'objective' : 'outcome'}`);
    } finally {
      setOutcomesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading project details...</h2>
        </div>
      </div>
    );
  }

  

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
          <Link
            to="/Student/ArchivedProjects"
            className="text-[#9b1a31] hover:text-[#82001A]"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/Student/ArchivedProjects"
            className="flex items-center gap-2 text-gray-600 hover:text-[#9b1a31]"
          >
            <FaArrowLeft />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Title and Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {project.projectDetails.projectTitle}
              </h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                  {project.projectDetails.projectStatus}
                </span>
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">
                  {project.projectDetails.projectType}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {project.projectDetails.githubURL && (
                <a
                  href={project.projectDetails.githubURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded"
                >
                  <FaGithub size={30} />
                </a>
              )}
              {project.projectDetails.googleDriveLink && (
                <a
                  href={project.projectDetails.googleDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded"
                >
                  <FaGoogleDrive size={30} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-6">
          <TabButton tab="overview" label="Overview" />
          <TabButton tab="team" label="Team" />
          <TabButton tab="reviews" label="Reviews" />
          <TabButton tab="outcomes" label="Outcomes" />
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Started On:</span>
                      <span className="text-sm">{new Date(project.projectDetails.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Completed On:</span>
                      <span className="text-sm">{new Date(project.projectDetails.completedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Technologies Used</h3>
                    <button 
                      onClick={() => setEditMode({...editMode, techStack: !editMode.techStack})}
                      className="p-1 text-gray-600 hover:text-[#9b1a31] rounded-full hover:bg-gray-100"
                      disabled={outcomesLoading}
                    >
                      <FaPen size={14} />
                    </button>
                  </div>
                  
                  {outcomesLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#9b1a31]"></div>
                    </div>
                  ) : (
                    <>
                      {editMode.techStack ? (
                        <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                            {techStack.map((tech, index) => (
                              <div 
                        key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center group"
                      >
                                <span>{tech}</span>
                                <button 
                                  onClick={() => handleDeleteItem('techStack', index)}
                                  className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete technology"
                                >
                                  <FaTrash size={10} />
                                </button>
                              </div>
                    ))}
                  </div>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={techInput}
                              onChange={(e) => setTechInput(e.target.value)}
                              placeholder="Add new technology"
                              className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
                              onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                            />
                            <button
                              onClick={handleAddTech}
                              className="p-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                            >
                              <FaPlus size={14} />
                            </button>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={handleSaveTechStack}
                              className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] flex items-center gap-1"
                            >
                              <Save size={14} />
                              Save
                            </button>
                            <button
                              onClick={() => handleCancelEdit('techStack')}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {techStack.length > 0 ? (
                            techStack.map((tech, index) => (
                              <div 
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center group"
                              >
                                <span>{tech}</span>
                                <button 
                                  onClick={() => handleDeleteItem('techStack', index)}
                                  className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete technology"
                                >
                                  <FaTrash size={10} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500">No technologies specified.</span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Project Description</h3>
                <p className="text-gray-600">{project.projectDetails.projectOverview || 'No description available.'}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Objectives</h3>
                  <button 
                    onClick={() => setEditMode({...editMode, objectives: !editMode.objectives})}
                    className="p-1 text-gray-600 hover:text-[#9b1a31] rounded-full hover:bg-gray-100"
                    disabled={outcomesLoading}
                  >
                    <FaPen size={14} />
                  </button>
                </div>
                
                {outcomesLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#9b1a31]"></div>
                  </div>
                ) : (
                  <>
                    {editMode.objectives ? (
                      <div className="space-y-3">
                        <ul className="list-disc list-inside space-y-2">
                          {objectives.map((objective, index) => (
                            <li key={index} className="text-gray-600 group flex items-start">
                              <span className="flex-1">{objective}</span>
                              <button 
                                onClick={() => handleDeleteItem('objectives', index)}
                                className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity pt-1"
                                title="Delete objective"
                              >
                                <FaTrash size={10} />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={objectiveInput}
                            onChange={(e) => setObjectiveInput(e.target.value)}
                            placeholder="Add new objective"
                            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
                          />
                          <button
                            onClick={handleAddObjective}
                            className="p-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={handleSaveObjectives}
                            className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] flex items-center gap-1"
                          >
                            <Save size={14} />
                            Save
                          </button>
                          <button
                            onClick={() => handleCancelEdit('objectives')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                <ul className="list-disc list-inside space-y-2">
                        {objectives.length > 0 ? (
                          objectives.map((objective, index) => (
                            <li key={index} className="text-gray-600 group flex items-start">
                              <span className="flex-1">{objective}</span>
                              <button 
                                onClick={() => handleDeleteItem('objectives', index)}
                                className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity pt-1"
                                title="Delete objective"
                              >
                                <FaTrash size={10} />
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-600">No objectives specified.</li>
                        )}
                </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              {/* Guide Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Project Guide</h3>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {project.facultyDetails.guide?.name || 'Not Assigned'}
                      </h4>
                      <p className="text-sm text-gray-500">{project.facultyDetails.guide?.facultyID || ''}</p>
                      <p className="text-sm text-gray-600 mt-1">{project.facultyDetails.guide?.email || ''}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Section */}
              <h3 className="text-lg font-semibold mb-6">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.teamDetails.members.map((member) => (
                  <div
                    key={member.studentID}
                    className="p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-500">{member.studentID}</p>
                        <p className="text-sm text-gray-600 mt-1">{member.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-10">
              {/* Guide Reviews Table */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-center">
                  <h3 className="text-2xl font-bold text-gray-900">Guide Reviews</h3>
                </div>
                {project.workDetails.reviews.guideReviews.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No guide reviews available yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Review Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detailed Feedback
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Satisfaction Level
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {project.workDetails.reviews.guideReviews.map((review, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {review.reviewName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(review.dateOfReview).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {review.remarks || "No remarks provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-md">
                                {review.feedback || "No detailed feedback provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {review.satisfactionLevel ? (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${satisfactionColors[review.satisfactionLevel]}`}>
                                  {review.satisfactionLevel}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Incharge Reviews Table */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-center">
                  <h3 className="text-2xl font-bold text-gray-900">Incharge Reviews</h3>
                </div>
                {project.workDetails.reviews.inchargeReviews.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No incharge reviews available yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Review Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detailed Feedback
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Satisfaction Level
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {project.workDetails.reviews.inchargeReviews.map((review, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {review.reviewName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(review.dateOfReview).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {review.remarks || "No remarks provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-md">
                                {review.feedback || "No detailed feedback provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {review.satisfactionLevel ? (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${satisfactionColors[review.satisfactionLevel]}`}>
                                  {review.satisfactionLevel}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'outcomes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Project Outcomes</h3>
                <button 
                  onClick={() => setEditMode({...editMode, outcomes: !editMode.outcomes})}
                  className="p-1 text-gray-600 hover:text-[#9b1a31] rounded-full hover:bg-gray-100"
                  disabled={outcomesLoading}
                >
                  <FaPen size={14} />
                </button>
              </div>
              
              {outcomesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9b1a31]"></div>
                </div>
              ) : (
                <>
                  {editMode.outcomes ? (
              <div className="space-y-4">
                      {outcomes.map((outcome, index) => (
                  <div
                    key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-sm">
                      ✓
                          </div>
                          <p className="text-gray-700 flex-1">{outcome}</p>
                          <button 
                            onClick={() => handleDeleteItem('outcomes', index)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete outcome"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}

                      {outcomes.length === 0 && (
                        <div className="text-center text-gray-500">
                          No outcomes added yet.
                        </div>
                      )}

                      <div className="flex items-center mt-4">
                        <input
                          type="text"
                          value={outcomeInput}
                          onChange={(e) => setOutcomeInput(e.target.value)}
                          placeholder="Add new outcome"
                          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddOutcome()}
                        />
                        <button
                          onClick={handleAddOutcome}
                          className="p-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleSaveOutcomes}
                          className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] flex items-center gap-1"
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit('outcomes')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {outcomes.length > 0 ? (
                        outcomes.map((outcome, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
                          >
                            <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-sm">
                              ✓
                            </div>
                            <p className="text-gray-700 flex-1">{outcome}</p>
                            <button 
                              onClick={() => handleDeleteItem('outcomes', index)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete outcome"
                            >
                              <FaTrash size={14} />
                            </button>
                  </div>
                        ))
                      ) : (
                  <div className="text-center text-gray-500">
                    No outcomes specified for this project.
                  </div>
                )}
              </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedProjectDetails; 
