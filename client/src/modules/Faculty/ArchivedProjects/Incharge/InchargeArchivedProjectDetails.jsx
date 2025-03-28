import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogleDrive, FaUsers, FaClipboardCheck, FaArrowLeft } from 'react-icons/fa';
import { Calendar, CheckCircle } from 'lucide-react';
import { useStore } from "@/store/useStore";

const satisfactionColors = {
  'Excellent': 'bg-purple-100 text-purple-800',
  'Very Good': 'bg-blue-100 text-blue-800', 
  'Good': 'bg-yellow-100 text-yellow-800',
  'Fair': 'bg-orange-100 text-orange-800',
  'Poor': 'bg-red-100 text-red-800'
};

const InchargeArchivedProjectDetails = () => {
  const { projectId, classSection } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get data and functions from the store
  const { 
    activeProjects, 
    isLoading, 
    error, 
    fetchLeadedProjects,
    user 
  } = useStore();

  // Fetch leaded projects when component mounts
  useEffect(() => {
    if (!activeProjects) {
      fetchLeadedProjects(user?.facultyID);
    }
  }, [user, fetchLeadedProjects, activeProjects]);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Find the project details based on projectId
  const projectDetails = React.useMemo(() => {
    if (!activeProjects?.teams) {
      return null;
    }

    // Find the team with the matching ID
    const team = activeProjects.teams.find(t => t._id === projectId || t.teamId === projectId);
    if (!team) return null;

    // Find the section team for this project
    const sectionTeam = activeProjects.sectionTeams.find(
      st => team.teamId.startsWith(st.classID) && st.status === 'completed'
    );
    if (!sectionTeam) return null;

    // Parse class and section from the URL parameter
    const [department, section] = classSection ? classSection.split('-') : ['', ''];

    // Format the project details
    return {
      projectId: team._id || team.teamId,
      title: team.projectTitle || "Untitled Project",
      type: sectionTeam.projectType?.replace("Project", "").trim() || "Unknown",
      department: department,
      section: section,
      batch: team.batch || "Current Batch",
      teamSize: team.members?.length || 0,
      reviewsConducted: team.reviews?.length || 0,
      status: "completed",
      facultyGuide: team.guide?.name || "Not Assigned",
      completionDate: formatDate(team.completedAt || sectionTeam.completedAt || sectionTeam.updatedAt),
      guide: {
        name: team.guide?.name || "Not Assigned",
        department: team.guide?.department || department,
        email: team.guide?.email || "Not Available"
      },
      teamMembers: team.members?.map((member, index) => ({
        id: member.studentID || index,
        name: member.name || `Student ${index + 1}`,
        regNo: member.studentID || "Not Available",
        role: member.role || "Team Member"
      })) || [],
      githubLink: team.githubLink || "#",
      driveLink: team.driveLink || "#",
      description: team.description || "No description available.",
      technologies: team.technologies || 
        (typeof team.techStack === 'string' ? team.techStack.split(',').map(tech => tech.trim()) : 
        Array.isArray(team.techStack) ? team.techStack : ["Not specified"]),
      objectives: team.objectives?.split('\n').filter(obj => obj.trim()) || ["Not specified"],
      outcomes: team.outcomes?.split('\n').filter(out => out.trim()) || ["Project completed successfully"],
      reviews: team.reviews?.map((review, index) => ({
        id: review._id || index,
        reviewName: review.title || `Review ${index + 1}`,
        date: formatDate(review.date || review.createdAt),
        phase: `Review ${index + 1}`,
        satisfactionLevel: review.satisfactionLevel || "Good",
        remarks: review.remarks || "No remarks provided",
        feedback: review.feedback || "No detailed feedback provided",
        status: "reviewed"
      })) || []
    };
  }, [activeProjects, projectId, classSection]);

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-[#9b1a31] text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error loading project details: {error}</p>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to={`/Faculty/ArchivedProjects/Incharge/${classSection}`}
              className="flex items-center gap-2 text-gray-600 hover:text-[#9b1a31]"
            >
              <FaArrowLeft />
              <span>Back to Projects</span>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <p className="text-center text-gray-500 py-8">Project not found or has been removed.</p>
          </div>
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
            to={`/Faculty/ArchivedProjects/Incharge/${classSection}`}
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
                {projectDetails.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                  Completed
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={projectDetails.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded"
              >
                <FaGithub size={30} />
              </a>
              <a
                href={projectDetails.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded"
              >
                <FaGoogleDrive size={30} />
              </a>
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
                      <span className="w-32 text-sm font-medium">Department:</span>
                      <span className="text-sm">{projectDetails.department}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Section:</span>
                      <span className="text-sm">{projectDetails.section}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Batch:</span>
                      <span className="text-sm">{projectDetails.batch}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Completed On:</span>
                      <span className="text-sm">{projectDetails.completionDate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectDetails.technologies.map((tech, index) => (
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
                <p className="text-gray-600">{projectDetails.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Objectives</h3>
                <ul className="list-disc list-inside space-y-2">
                  {projectDetails.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-600">{objective}</li>
                  ))}
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
                        {projectDetails.guide.name}
                      </h4>
                      <p className="text-sm text-gray-500">{projectDetails.guide.department}</p>
                      <p className="text-sm text-gray-600 mt-1">{projectDetails.guide.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Section */}
              <h3 className="text-lg font-semibold mb-6">Team Members</h3>
              {projectDetails.teamMembers.length === 0 ? (
                <p className="text-gray-500">No team members found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetails.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {member.name}
                          </h4>
                          <p className="text-sm text-gray-500">{member.regNo}</p>
                          <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Review History</h3>
              {projectDetails.reviews.length === 0 ? (
                <p className="text-gray-500">No reviews found for this project.</p>
              ) : (
                <div className="space-y-4">
                  {projectDetails.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {review.reviewName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${satisfactionColors[review.satisfactionLevel] || 'bg-gray-100 text-gray-700'}`}>
                          {review.satisfactionLevel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {review.date}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Remarks</h4>
                          <p className="mt-1 text-sm text-gray-600">{review.remarks}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Detailed Feedback</h4>
                          <p className="mt-1 text-sm text-gray-600">{review.feedback}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Reviewed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'outcomes' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Project Outcomes</h3>
              {projectDetails.outcomes.length === 0 || projectDetails.outcomes[0] === "Not specified" ? (
                <p className="text-gray-500">No specific outcomes recorded for this project.</p>
              ) : (
                <div className="space-y-4">
                  {projectDetails.outcomes.map((outcome, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-sm">
                        ✓
                      </div>
                      <p className="text-gray-700">{outcome}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InchargeArchivedProjectDetails; 