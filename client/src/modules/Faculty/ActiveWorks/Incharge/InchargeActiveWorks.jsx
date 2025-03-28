import React, { useState, useEffect } from "react";
import { Search, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";

const InchargeActiveWorks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  
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

  // Define project type categories
  const categories = ['all', 'CBP', 'Mini', 'Major'];

  // Process the data to create a list of projects with all needed information
  const processedProjects = React.useMemo(() => {
    if (!activeProjects?.sectionTeams || !activeProjects?.teams) {
      return [];
    }

    return activeProjects.sectionTeams.map(sectionTeam => {
      // Find all teams that belong to this section
      const teamsInSection = activeProjects.teams.filter(team => 
        team.teamId.startsWith(sectionTeam.classID)
      );

      // Count completed reviews across all teams
      const reviewsCompleted = teamsInSection.reduce((total, team) => 
        total + (team.reviews?.length || 0), 0);

      // Calculate average progress (placeholder)
      const progress = Math.min(
        Math.floor((reviewsCompleted / (teamsInSection.length * 3)) * 100), 
        100
      );

      // Get batch from the first team (assuming all teams in a section have the same batch)
      const batch = teamsInSection.length > 0 ? teamsInSection[0].batch || "Current Batch" : "Current Batch";

      return {
        id: sectionTeam.classID,
        classID: sectionTeam.classID,
        branch: sectionTeam.branch,
        section: sectionTeam.section,
        projectType: sectionTeam.projectType,
        numberOfTeams: sectionTeam.numberOfTeams,
        createdAt: sectionTeam.createdAt,
        progress: progress,
        reviewsCompleted: reviewsCompleted,
        totalReviews: teamsInSection.length * 3, // Assuming 3 reviews per team
        status: sectionTeam.status,
        batch: batch
      };
    });
  }, [activeProjects]);

  // Filter projects based on search query and selected category
  const filteredProjects = processedProjects.filter(
    (project) =>
      (selectedCategory === 'all' || 
       project.projectType.includes(selectedCategory)) &&
      (project.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       project.section?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCardClick = (project) => {
    navigate(`/Faculty/ActiveWorks/Incharge/${project.classID}`);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Major": return "bg-purple-100 text-purple-700";
      case "Mini": return "bg-indigo-100 text-indigo-700";
      case "FP": return "bg-blue-100 text-blue-700";
      case "CBP": return "bg-teal-100 text-teal-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Format date or provide a default
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
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
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-center">
            ActiveWorks - Incharge
          </h1>
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      <div className="flex justify-center gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-6 py-2 rounded-lg capitalize font-medium transition-all duration-200
              ${selectedCategory === category
                ? 'bg-[#9b1a31] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No active projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="relative"
              onClick={() => handleCardClick(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleCardClick(project)}
            >
              {/* Stacked card effect with enhanced shadows */}
              <div className="absolute -bottom-4 left-4 w-full h-full bg-white rounded-lg shadow-sm"></div>
              <div className="absolute -bottom-2 left-2 w-full h-full bg-white rounded-lg shadow-md"></div>

              <div
                className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.branch || "Unknown Branch"}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(project.projectType)}`}>
                        {project.projectType?.replace("Project", "").trim() || "Unknown"}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                        {project.status || "In Progress"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>Section: {project.section || "N/A"} ({project.numberOfTeams || 0} teams)</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {formatDate(project.createdAt)}</span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-[#9b1a31]">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Batch: {project.batch}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          Teams: {project.numberOfTeams || 0}
                        </span>
                      </div>
                    </div>
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

export default InchargeActiveWorks; 