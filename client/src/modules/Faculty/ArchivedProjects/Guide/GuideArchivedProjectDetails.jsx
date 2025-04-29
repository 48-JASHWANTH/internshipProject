import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaGoogleDrive, FaArrowLeft } from 'react-icons/fa';
import { 
  Calendar, 
  CheckCircle, 
  FileText, 
  Book, 
  Users, 
  Award, 
  Briefcase, 
  Code, 
  Target, 
  CheckSquare, 
  GraduationCap, 
  Building2, 
  Layers,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useStore } from "@/store/useStore";
import { format } from "date-fns";

const satisfactionColors = {
  'Excellent': 'bg-green-100 text-green-700',
  'Good': 'bg-blue-100 text-blue-700',
  'Satisfactory': 'bg-yellow-100 text-yellow-700',
  'Needs Improvement': 'bg-orange-100 text-orange-700',
  'Poor': 'bg-red-100 text-red-700'
};

const GuideArchivedProjectDetails = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get data and functions from the store
  const { 
    guidedProjects, 
    isLoading, 
    error, 
    fetchGuidedProjects,
    user 
  } = useStore();

  // Fetch guided projects when component mounts
  useEffect(() => {
    if (!guidedProjects) {
      fetchGuidedProjects(user?.facultyID);
    }
  }, [user, fetchGuidedProjects, guidedProjects]);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  // Find the project details based on projectId
  const projectDetails = React.useMemo(() => {
    if (!guidedProjects?.teams) {
      return null;
    }

    // Find the team with the matching ID
    const team = guidedProjects.teams.find(t => t._id === projectId || t.teamId === projectId);
    if (!team) return null;

    // Find the section team for this project
    const sectionTeam = guidedProjects.sectionTeams?.find(
      st => team.teamId.startsWith(st.classID)
    );

    // Format the project details
    return {
      projectId: team._id || team.teamId,
      title: team.projectTitle || "Untitled Project",
      type: team.projectType?.replace("Project", "").trim() || "Unknown",
      department: team.branch || sectionTeam?.branch || "Unknown",
      section: team.section || sectionTeam?.section || "N/A",
      batch: team.batch || "Current Batch",
      teamSize: team.listOfStudents?.length || 0,
      reviewsConducted: team.reviews?.length || 0,
      status: "completed",
      facultyGuide: team.guideFacultyId || "Not Assigned",
      completionDate: formatDate(team.completedAt || team.updatedAt || team.createdAt),
      teamMembers: team.listOfStudents?.map((member, index) => ({
        id: member.id || index,
        name: member.name || `Student ${index + 1}`,
        regNo: member.regNo || member.id || `Student ID ${index + 1}`,
        role: member.role || "Team Member"
      })) || [],
      githubLink: team.githubLink || "#",
      driveLink: team.driveLink || "#",
      description: team.description || "No description available.",
      technologies: team.technologies || 
        (typeof team.techStack === 'string' ? team.techStack.split(',').map(tech => tech.trim()) : 
        Array.isArray(team.techStack) ? team.techStack : ["Not specified"]),
      objectives: Array.isArray(team.objectives) 
        ? team.objectives.filter(obj => obj && obj.trim()) 
        : (typeof team.objectives === 'string' 
          ? team.objectives.split('\n').filter(obj => obj.trim()) 
          : ["Not specified"]),
      outcomes: Array.isArray(team.outcomes) 
        ? team.outcomes.filter(out => out && out.trim()) 
        : (typeof team.outcomes === 'string' 
          ? team.outcomes.split('\n').filter(out => out.trim()) 
          : ["Project completed successfully"]),
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
  }, [guidedProjects, projectId]);

  const TabButton = ({ tab, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
        activeTab === tab
          ? 'bg-[#9b1a31] text-white shadow-sm'
          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
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
              to="/Faculty/ArchivedProjects/Guide"
              className="flex items-center gap-2 text-gray-600 hover:text-[#9b1a31]"
            >
              <FaArrowLeft />
              <span>Back to Projects</span>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Project not found</h3>
            <p className="text-gray-500">The project you're looking for doesn't exist or you don't have access to it.</p>
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
            to="/Faculty/ArchivedProjects/Guide"
            className="flex items-center gap-2 text-gray-600 hover:text-[#9b1a31] transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Title and Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {projectDetails.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Completed
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  projectDetails.type.includes("CBP") ? "bg-blue-50 text-blue-700" :
                  projectDetails.type.includes("Mini") ? "bg-orange-50 text-orange-700" :
                  projectDetails.type.includes("Major") ? "bg-purple-50 text-purple-700" :
                  "bg-gray-50 text-gray-700"
                }`}>
                  {projectDetails.type}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {projectDetails.githubLink && projectDetails.githubLink !== "#" && (
                <a
                  href={projectDetails.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                  aria-label="GitHub Repository"
                >
                  <FaGithub size={24} />
                </a>
              )}
              {projectDetails.driveLink && projectDetails.driveLink !== "#" && (
                <a
                  href={projectDetails.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                  aria-label="Google Drive"
                >
                  <FaGoogleDrive size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <TabButton tab="overview" label="Overview" icon={FileText} />
          <TabButton tab="team" label="Team" icon={Users} />
          <TabButton tab="reviews" label="Reviews" icon={Book} />
          <TabButton tab="outcomes" label="Outcomes" icon={Award} />
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Briefcase className="w-5 h-5 text-[#9b1a31]" />
                    Project Details
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
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
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Code className="w-5 h-5 text-[#9b1a31]" />
                    Technologies Used
                  </h3>
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
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <FileText className="w-5 h-5 text-[#9b1a31]" />
                  Project Description
                </h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{projectDetails.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <Target className="w-5 h-5 text-[#9b1a31]" />
                  Objectives
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {projectDetails.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <CheckSquare className="w-5 h-5 text-[#9b1a31] mt-0.5 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <Users className="w-5 h-5 text-[#9b1a31]" />
                Team Members
              </h3>
              {projectDetails.teamMembers.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No team members found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetails.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#9b1a31] text-white flex items-center justify-center font-medium text-lg">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
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
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <Book className="w-5 h-5 text-[#9b1a31]" />
                Review History
              </h3>
              {projectDetails.reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Book className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No reviews found for this project.</p>
                </div>
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
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <Award className="w-5 h-5 text-[#9b1a31]" />
                Project Outcomes
              </h3>
              {projectDetails.outcomes.length === 0 || projectDetails.outcomes[0] === "Not specified" ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No outcomes specified for this project.</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-5">
                  <ul className="space-y-3">
                    {projectDetails.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600">
                        <CheckSquare className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideArchivedProjectDetails; 