import React, { useState, useEffect } from "react";
import { Search, User, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";

const InchargeArchivedProjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    batch: 'all',
    department: 'all',
    section: 'all',
    type: 'all'
  });

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

  // Filter options
  const batchYears = ['2022-2026', '2023-2027', '2024-2028', '2025-2029'];
  const departments = ['CSE', 'CSBS', 'IT', 'CSDS', 'AIML', 'IOT', 'CyS', 'AIDS'];
  const sections = ['A', 'B', 'C', 'D'];
  const projectTypes = ['CBP', 'Mini', 'Major'];

  // Format date or provide a default
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  // Process the data to create a list of completed projects
  const processedProjects = React.useMemo(() => {
    if (!activeProjects?.sectionTeams || !activeProjects?.teams) {
      return [];
    }

    return activeProjects.sectionTeams
      .filter(sectionTeam => sectionTeam.status === 'completed') // Only include completed projects
      .map(sectionTeam => {
        // Find all teams that belong to this section
        const teamsInSection = activeProjects.teams.filter(team => 
          team.teamId.startsWith(sectionTeam.classID)
        );

        // Count completed reviews across all teams
        const reviewsCompleted = teamsInSection.reduce((total, team) => 
          total + (team.reviews?.length || 0), 0);

        // Calculate total projects
        const totalProjects = teamsInSection.length;

        return {
          id: sectionTeam.classID,
          className: sectionTeam.branch || "Unknown Branch",
          section: sectionTeam.section || "N/A",
          teams: sectionTeam.numberOfTeams || 0,
          type: sectionTeam.projectType?.replace("Project", "").trim() || "Unknown",
          completionRate: 100, // Since we're filtering for completed projects
          completionDate: formatDate(sectionTeam.completedAt || sectionTeam.updatedAt || sectionTeam.createdAt),
          reviewsCompleted: reviewsCompleted,
          totalReviews: teamsInSection.length * 3, // Assuming 3 reviews per team
          totalProjects: totalProjects
        };
      });
  }, [activeProjects]);

  // Filter projects based on search query and selected filters
  const filteredProjects = processedProjects.filter(
    (project) =>
      (filters.type === 'all' || project.type === filters.type) &&
      (filters.department === 'all' || project.className.includes(filters.department)) &&
      (filters.section === 'all' || project.section === filters.section) &&
      (project.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
       project.section.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCardClick = (project) => {
    navigate(`/Faculty/ArchivedProjects/Incharge/${project.className}-${project.section}`);
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
            Archived Projects - Incharge
          </h1>
        </div>
      </div>

      {/* Search and Filters Container */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col gap-6">
          {/* Search Bar and Filter Toggle */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Filter className="text-gray-600" />
              <span className="text-gray-600">Filters</span>
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <select
                value={filters.batch}
                onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
              >
                <option value="all">All Batches</option>
                {batchYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={filters.section}
                onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
              >
                <option value="all">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
              >
                <option value="all">All Types</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Project Cards Grid */}
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
              {/* Stacked card effect */}
              <div className="absolute -bottom-4 left-4 w-full h-full bg-white rounded-lg shadow-sm"></div>
              <div className="absolute -bottom-2 left-2 w-full h-full bg-white rounded-lg shadow-md"></div>

              <div className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.className}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(project.type)}`}>
                        {project.type}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                        Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>Section: {project.section} ({project.teams} teams)</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Completed: {project.completionDate}</span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Projects Completed</span>
                        <span className="text-sm font-medium">{project.totalProjects}/{project.totalProjects}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                          style={{ width: '100%' }}
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

export default InchargeArchivedProjects;
