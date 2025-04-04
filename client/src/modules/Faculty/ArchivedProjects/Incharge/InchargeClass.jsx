import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FaGithub, FaGoogleDrive, FaEye, FaUsers, FaClipboardCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";

const InchargeClass = () => {
  const navigate = useNavigate();
  const { classSection } = useParams(); // Will be in format "CSBS-A"
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get data and functions from the store
  const { 
    activeProjects, 
    isLoading, 
    error, 
    fetchLeadedProjects,
    user 
  } = useStore();

  // Parse class and section from the URL parameter
  const [className, section] = classSection ? classSection.split('-') : ['', ''];

  // Fetch leaded projects when component mounts
  useEffect(() => {
    if (!activeProjects) {
      fetchLeadedProjects(user?.facultyID);
    }
  }, [user, fetchLeadedProjects, activeProjects]);

  // Process the data to get projects for this class and section
  const classProjects = React.useMemo(() => {
    if (!activeProjects?.sectionTeams || !activeProjects?.teams) {
      return [];
    }

    // Find the section team that matches our class and section
    const sectionTeam = activeProjects.sectionTeams.find(
      st => st.branch === className && st.section === section && st.status === 'completed'
    );

    if (!sectionTeam) return [];

    // Find all teams that belong to this section
    return activeProjects.teams
      .filter(team => team.teamId.startsWith(sectionTeam.classID))
      .map(team => {
        return {
          id: team._id || team.teamId,
          teamId: team.teamId,
          teamNo: team.teamId.split('_')[1] || "00", // Extract team number from teamId
          title: team.projectTitle || "Untitled Project",
          teamMembers: team.members || [],
          type: sectionTeam.projectType?.replace("Project", "").trim() || "Unknown",
          department: className,
          section: section,
          batch: team.batch || "Current Batch",
          reviewsCompleted: team.reviews?.length || 0,
          totalReviews: 3, // Assuming 3 reviews per team
          githubLink: team.githubLink || "#",
          driveLink: team.driveLink || "#",
          status: team.status || "completed"
        };
      });
  }, [activeProjects, className, section]);

  // Filter projects based on search query
  const filteredProjects = classProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.teamMembers.some((member) =>
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.studentID?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getTypeColor = (type) => {
    if (!type) return "bg-gray-50 text-gray-700";
    
    if (type.includes("CBP")) 
      return "bg-blue-50 text-blue-700";
    if (type.includes("Mini")) 
      return "bg-orange-50 text-orange-700";
    if (type.includes("Major")) 
      return "bg-purple-50 text-purple-700";
    return "bg-gray-50 text-gray-700";
  };

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
          <p>Error loading projects: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6 relative">
        <button
          onClick={() => navigate("/Faculty/ArchivedProjects/Incharge")}
          className="absolute left-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold w-full text-center">
          {classSection} Projects
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search projects or team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="p-5">
                {/* Project Title with Team Number */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {project.teamNo} - {project.title}
                </h3>

                {/* Project Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <span className="w-24 text-sm font-medium">Department:</span>
                    <span className="text-sm">{project.department}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-24 text-sm font-medium">Section:</span>
                    <span className="text-sm">{project.section}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-24 text-sm font-medium">Batch:</span>
                    <span className="text-sm">{project.batch}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.teamMembers.length} members</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClipboardCheck className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.reviewsCompleted} reviews</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200">
                  <Link
                    to={`/Faculty/ArchivedProjects/Incharge/${classSection}/${project.id}`}
                    className="w-40 flex items-center justify-center gap-1 px-2 py-1.5 bg-[#9b1a31] text-white rounded hover:bg-[#82001A] transition-colors text-s"
                  >
                    <FaEye size={15} />
                    <span>View Details</span>
                  </Link>
                  
                  <div className="flex-1 flex justify-center gap-2">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                      title="GitHub Repository"
                    >
                      <FaGithub size={30} />
                    </a>
                    
                    <a
                      href={project.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                      title="Google Drive"
                    >
                      <FaGoogleDrive size={30} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InchargeClass; 