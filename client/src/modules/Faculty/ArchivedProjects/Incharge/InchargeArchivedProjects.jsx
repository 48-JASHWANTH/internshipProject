import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  User, 
  Calendar, 
  Filter, 
  GraduationCap, 
  School, 
  Users, 
  CheckCircle2,
  Building2,
  Layers
} from "lucide-react";
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
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 4); // Default to 4 years ago

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

  // Dynamically calculate batch years based on start year
  const batchYears = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      const start = startYear + i;
      const end = String(start + 4).slice(-2); // Get last 2 digits
      years.push(`${start}-${end}`);
    }
    return years;
  }, [startYear]);

  // Filter options
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
  const processedProjects = useMemo(() => {
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
          totalProjects: totalProjects,
          batch: sectionTeam.batch || "N/A",
          year: sectionTeam.year || "N/A",
          semester: sectionTeam.sem || "N/A"
        };
      });
  }, [activeProjects]);

  // Filter projects based on search query and selected filters
  const filteredProjects = useMemo(() => {
    return processedProjects.filter(
      (project) =>
        (filters.type === 'all' || project.type === filters.type) &&
        (filters.department === 'all' || project.className.includes(filters.department)) &&
        (filters.section === 'all' || project.section === filters.section) &&
        (filters.batch === 'all' || project.batch === filters.batch) &&
        (project.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
         project.section.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [processedProjects, filters, searchQuery]);

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

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    if (!isNaN(year) && year > 1990 && year < 2100) {
      setStartYear(year);
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
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center">
            <Layers className="inline-block mr-2 mb-1 text-[#9b1a31]" size={32} />
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
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Start Year</label>
                <input
                  type="number"
                  value={startYear}
                  onChange={handleYearChange}
                  min="1990"
                  max="2100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
                />
              </div>
              
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
        <div className="bg-white border border-gray-200 text-gray-700 px-8 py-16 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <Layers className="w-12 h-12 mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">No archived projects found</h3>
          <p className="text-gray-500 text-center max-w-md">
            {searchQuery || Object.values(filters).some(v => v !== 'all')
              ? "Try adjusting your search or filter criteria" 
              : "You don't have any archived projects yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
                    {project.className}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-medium ${getTypeColor(project.type)} rounded-full flex items-center gap-1.5`}>
                      {project.type}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <School className="w-4 h-4 text-gray-500" />
                      <span>Year: {project.year}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Section: {project.section}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Completed: {project.completionDate}</span>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Projects Completed</span>
                      <span className="text-sm font-medium">{project.totalProjects}/{project.totalProjects}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-[#9b1a31] rounded-full h-2.5 transition-all duration-300"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        Batch: {project.batch}
                      </span>
                      <span className="text-sm font-medium text-[#9b1a31] flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {project.teams} Teams
                      </span>
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
