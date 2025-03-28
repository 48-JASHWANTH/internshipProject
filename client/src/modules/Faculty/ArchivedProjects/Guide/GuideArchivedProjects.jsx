import React, { useState, useEffect } from "react";
import { Search, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";

const GuideArchivedProjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get data and functions from the store
  const { 
    guidedProjects, 
    isLoading, 
    error, 
    fetchGuidedProjects,
    user 
  } = useStore();

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  // Fetch guided projects when component mounts
  useEffect(() => {
    if (!guidedProjects) {
      fetchGuidedProjects(user?.facultyID);
    }
  }, [user, fetchGuidedProjects, guidedProjects]);

  // Define project type categories
  const categories = ['all', 'CBP', 'Mini', 'Major'];

  // Process the data to create a list of completed projects
  const processedProjects = React.useMemo(() => {
    if (!guidedProjects?.teams) {
      return [];
    }

    // Filter for completed projects only
    return guidedProjects.teams
      .filter(team => team.status === 'completed')
      .map(team => {
        // Find the section team for this project
        const sectionTeam = guidedProjects.sectionTeams?.find(
          st => team.teamId.startsWith(st.classID)
        );

        // Extract branch and section from sectionTeam
        const branch = sectionTeam?.branch || "Unknown";
        const section = sectionTeam?.section || "N/A";
        const projectType = sectionTeam?.projectType?.replace("Project", "").trim() || "Unknown";

        return {
          id: team._id || team.teamId,
          teamId: team.teamId,
          title: team.projectTitle || "Untitled Project",
          branch: branch,
          section: section,
          projectType: projectType,
          teamSize: team.members?.length || 0,
          completionDate: formatDate(team.completedAt || team.updatedAt || team.createdAt),
          reviewsCompleted: team.reviews?.length || 0,
          totalReviews: 3, // Assuming 3 reviews per team
          progress: 100 // Since it's completed
        };
      });
  }, [guidedProjects]);

  // Filter projects based on search query and selected category
  const filteredProjects = processedProjects.filter(
    (project) =>
      (selectedCategory === 'all' || 
       project.projectType.includes(selectedCategory)) &&
      (project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       project.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
       project.section.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCardClick = (project) => {
    navigate(`/Faculty/ArchivedProjects/Guide/${project.id}`);
  };

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
      <div className="flex justify-between items-center mb-8">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Archived Projects - Guide
          </h1>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                selectedCategory === category
                  ? "bg-[#9b1a31] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No archived projects found.</p>
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
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(project.projectType)}`}>
                        {project.projectType}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                        Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>{project.branch} - {project.section} ({project.teamSize} members)</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Completed: {project.completionDate}</span>
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
                          Reviews: {project.reviewsCompleted}/{project.totalReviews}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          All Reviews Complete
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

export default GuideArchivedProjects;
