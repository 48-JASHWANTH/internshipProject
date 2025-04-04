import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaGoogleDrive, FaArrowLeft } from 'react-icons/fa';
import { Calendar, CheckCircle, FileText, Book, Users, Award, Briefcase, Code, Target, CheckSquare, GraduationCap, Building2, Layers, Clock } from 'lucide-react';
import { useStore } from "@/store/useStore";
import { format } from "date-fns";

const satisfactionColors = {
  'Excellent': 'bg-green-100 text-green-700',
  'Good': 'bg-blue-100 text-blue-700',
  'Satisfactory': 'bg-yellow-100 text-yellow-700',
  'Needs Improvement': 'bg-orange-100 text-orange-700',
  'Poor': 'bg-red-100 text-red-700'
};

const InchargeArchivedProjectDetails = () => {
  const { projectId, classSection } = useParams();
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
      return format(new Date(dateString), "yyyy-MM-dd");
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
    console.log(activeProjects);

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
      teamSize: team.listOfStudents?.length || 0,
      reviewsConducted: team.reviews?.length || 0,
      status: "completed",
      facultyGuide: team.guideFacultyId || "Not Assigned",
      completionDate: formatDate(team.completedAt || sectionTeam.completedAt || sectionTeam.updatedAt),
      teamMembers: team.listOfStudents?.map((member, index) => ({
        id: member.id || index,
        name: member.name || `Student ${index + 1}`,
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
              className="flex items-center gap-2 text-gray-600 hover:text-[#9b1a31] transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-6 text-center">
            <Layers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Project not found or has been removed.</p>
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
            className="flex items-center gap-2 text-gray-600 hover:text-[#9b1a31] transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Title and Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                {projectDetails.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Completed
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {projectDetails.type}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {projectDetails.completionDate}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={projectDetails.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 border border-gray-200"
              >
                <FaGithub size={20} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={projectDetails.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 border border-gray-200"
              >
                <FaGoogleDrive size={20} />
                <span className="hidden sm:inline">Drive</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <TabButton tab="overview" label="Overview" icon={Book} />
          <TabButton tab="team" label="Team" icon={Users} />
          <TabButton tab="reviews" label="Reviews" icon={Clock} />
          <TabButton tab="outcomes" label="Outcomes" icon={Award} />
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Briefcase className="w-5 h-5 text-[#9b1a31]" />
                    Project Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <span className="w-36 text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        Department:
                      </span>
                      <span className="text-sm">{projectDetails.department}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-36 text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        Section:
                      </span>
                      <span className="text-sm">{projectDetails.section}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-36 text-sm font-medium flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        Batch:
                      </span>
                      <span className="text-sm">{projectDetails.batch}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-36 text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Completed On:
                      </span>
                      <span className="text-sm">{projectDetails.completionDate}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Code className="w-5 h-5 text-[#9b1a31]" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {projectDetails.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm border border-gray-200 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <FileText className="w-5 h-5 text-[#9b1a31]" />
                  Project Description
                </h3>
                <p className="text-gray-600 leading-relaxed">{projectDetails.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <Target className="w-5 h-5 text-[#9b1a31]" />
                  Project Objectives
                </h3>
                <ul className="space-y-2">
                  {projectDetails.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <CheckSquare className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
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
                          <p className="text-sm text-gray-500">
                            ID: {member.id}
                          </p>
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
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <Award className="w-5 h-5 text-[#9b1a31]" />
                Project Outcomes
              </h3>
              {projectDetails.outcomes.length === 0 ? (
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

export default InchargeArchivedProjectDetails; 