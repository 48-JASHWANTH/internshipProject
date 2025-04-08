import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  User, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  School, 
  Users, 
  BookOpen,
  Building2,
  AlertCircle,
  Archive
} from "lucide-react";
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

  // console.log(guidedProjects);

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

  // Define project type categories and their icons
  const categories = ['all', 'CBP', 'Mini', 'Major'];
  
  const getTypeIcon = (type) => {
    if (!type) return Layers;
    
    if (type.includes("CBP")) 
      return Building2;
    if (type.includes("Mini")) 
      return School;
    if (type.includes("Major")) 
      return BookOpen;
    return Layers;
  };

  // Process the data to create a list of completed projects
  const processedProjects = useMemo(() => {
    if (!guidedProjects?.teams) {
      return [];
    }

    // Filter for completed projects only (status=true)
    return guidedProjects.teams
      .filter(team => team.status === true)
      .map(team => {
        // Find the section team for this project
        const Team = guidedProjects.teams?.find(
          st => team.teamId.startsWith(st.teamId)
        );

        // console.log(Team);

        // Extract branch and section from Team
        const branch = Team?.branch || "Unknown";
        const section = Team?.section || "N/A";
        const projectType = Team?.projectType?.replace("Project", "").trim() || "Unknown";

        return {
          id: team._id || team.teamId,
          teamId: team.teamId,
          title: team.projectTitle || "Untitled Project",
          branch: branch,
          section: section,
          projectType: projectType,
          teamSize: team.listOfStudents?.length || 0,
          completionDate: formatDate(team.completedAt || team.updatedAt || team.createdAt),
          reviewsCompleted: team.reviews?.length || 0,
          totalReviews: 3, // Assuming 3 reviews per team
          progress: 100, // Since it's completed
          year: team.year || Team?.year || "N/A",
          sem: team.sem || Team?.sem || "N/A",
          batch: team.batch || Team?.batch || "N/A"
        };
      });
  }, [guidedProjects]);

  // Filter projects based on search query and selected category
  const filteredProjects = useMemo(() => {
    return processedProjects.filter(
      (project) =>
        (selectedCategory === 'all' || 
         project.projectType.includes(selectedCategory)) &&
        (project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         project.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
         project.section.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [processedProjects, selectedCategory, searchQuery]);

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>Error loading projects: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center gap-3">
            <Archive className="text-[#9b1a31]" size={32} />
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
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => {
          const TypeIcon = category === 'all' ? null : getTypeIcon(category);
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${
                  selectedCategory === category
                    ? "bg-[#9b1a31] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm"
                }
              `}
            >
              {TypeIcon && <TypeIcon className="w-4 h-4" />}
              {category === 'all' ? 'All Categories' : category}
            </button>
          );
        })}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-gray-200 text-gray-700 px-8 py-16 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <Archive className="w-12 h-12 mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">No archived projects found</h3>
          <p className="text-gray-500 text-center max-w-md">
            {searchQuery || selectedCategory !== 'all'
              ? "Try adjusting your search or filter criteria" 
              : "You don't have any archived projects yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const TypeIcon = getTypeIcon(project.projectType);
            
            return (
              <div 
                key={project.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200"
                onClick={() => handleCardClick(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(project)}
              >
                <div className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 text-xs font-medium ${getTypeColor(project.projectType)} rounded-full flex items-center gap-1.5`}>
                        <TypeIcon className="w-3.5 h-3.5" />
                        {project.projectType}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      <span className="break-words">{project.branch}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <School className="w-4 h-4 text-gray-500" />
                        <span>Year: {project.year}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span>Semester: {project.sem}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>Section: {project.section}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Completed: {project.completionDate}</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-[#9b1a31]">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-[#9b1a31] rounded-full h-2.5 transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-gray-500" />
                          Batch: {project.batch || "N/A"}
                        </span>
                        <span className="text-sm font-medium text-[#9b1a31] flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {project.teamSize} Members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuideArchivedProjects;
