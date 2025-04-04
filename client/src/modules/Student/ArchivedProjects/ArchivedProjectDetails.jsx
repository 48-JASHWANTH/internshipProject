import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaGoogleDrive, FaUsers, FaClipboardCheck, FaArrowLeft } from 'react-icons/fa';
import { Calendar, CheckCircle } from 'lucide-react';
import { useStore } from '../../../store/useStore';

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
                  <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.projectDetails.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Project Description</h3>
                <p className="text-gray-600">{project.projectDetails.projectOverview || 'No description available.'}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Objectives</h3>
                <ul className="list-disc list-inside space-y-2">
                  {project.projectDetails.objectives?.map((objective, index) => (
                    <li key={index} className="text-gray-600">{objective}</li>
                  )) || <li className="text-gray-600">No objectives specified.</li>}
                </ul>
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
              <h3 className="text-lg font-semibold mb-6">Project Outcomes</h3>
              <div className="space-y-4">
                {project.projectDetails.outcomes?.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-sm">
                      ✓
                    </div>
                    <p className="text-gray-700">{outcome}</p>
                  </div>
                )) || (
                  <div className="text-center text-gray-500">
                    No outcomes specified for this project.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedProjectDetails; 
