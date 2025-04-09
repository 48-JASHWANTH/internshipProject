import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User, 
  AlertCircle, 
  BookOpen, 
  GraduationCap, 
  School, 
  Users, 
  Clock,
  CheckCircle2,
  Building2,
  Layers
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const InchargeActiveWorks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { 
    user, 
    activeProjects, 
    fetchLeadedProjects, 
    isLoading, 
    error 
  } = useStore();

  

  useEffect(() => {
    const loadActiveProjects = async () => {
      if (user?.facultyID) {
        const result = await fetchLeadedProjects(user.facultyID);
        if (!result.success) {
          toast.error(result.error || 'Failed to load active projects');
        }
      }
    };

    loadActiveProjects();
  }, [user, fetchLeadedProjects]);

  // Define standard project types
  const standardProjectTypes = ['Mini Project', 'Major Project', 'FP', 'CBP'];

  const getTypeColor = (type) => {
    switch (type) {
      case "Major Project": return "bg-purple-100 text-purple-700";
      case "Mini Project": return "bg-indigo-100 text-indigo-700";
      case "FP": return "bg-blue-100 text-blue-700";
      case "CBP": return "bg-teal-100 text-teal-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Major Project": return BookOpen;
      case "Mini Project": return School;
      case "FP": return GraduationCap;
      case "CBP": return Building2;
      default: return Layers;
    }
  };

  const formattedSections = useMemo(() => {
    if (!activeProjects?.sectionTeams) return [];
    
    // Filter to only include sections with status that is not 'completed'
    return activeProjects.sectionTeams
      .filter(sectionTeam => sectionTeam.status !== 'completed')
      .map(sectionTeam => {
        // Find all teams in this section
        const teamsInSection = activeProjects.teams?.filter(team => 
          team.teamId.startsWith(sectionTeam.classID)
        ) || [];
        
        // Calculate progress based on team completion
        const completedTeams = teamsInSection.filter(team => team.status === true).length;
        const totalTeams = teamsInSection.length;
        const progress = totalTeams > 0 ? Math.round((completedTeams / totalTeams) * 100) : 0;
        
        // Get batch directly from sectionTeam instead of from teams
        const batch = sectionTeam.batch || "Current Batch";
        
        // Normalize project type to match standard types
        let normalizedType = sectionTeam.projectType;
        if (normalizedType) {
          // Check if it's a close match to any standard type
          for (const standardType of standardProjectTypes) {
            if (normalizedType.toLowerCase().includes(standardType.toLowerCase())) {
              normalizedType = standardType;
              break;
            }
          }
        }
        
        return {
          id: sectionTeam.classID,
          title: `${sectionTeam.branch}`,
          category: normalizedType || "Other",
          branch: sectionTeam.branch,
          year: sectionTeam.year,
          section: sectionTeam.section,
          semester: sectionTeam.sem,
          status: "In Progress", // Always set to In Progress for active works
          startDate: format(new Date(sectionTeam.createdAt), 'yyyy-MM-dd'),
          teamCount: sectionTeam.numberOfTeams,
          studentCount: sectionTeam.numberOfStudents,
          batch: batch,
          progress: progress // Add progress based on team completion
        };
      });
  }, [activeProjects, standardProjectTypes]);

  // Use predefined categories plus any additional ones from the data
  const categories = useMemo(() => {
    const dataCategories = new Set(formattedSections.map(section => section.category));
    // Combine standard types with any additional types from the data
    const allCategories = new Set([...standardProjectTypes, ...dataCategories]);
    return ['all', ...allCategories];
  }, [formattedSections, standardProjectTypes]);

  const filteredSections = useMemo(() => {
    return formattedSections.filter(section => 
      (selectedCategory === 'all' || section.category === selectedCategory) &&
      (section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       section.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
       section.section.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [formattedSections, selectedCategory, searchQuery]);

  // Log data for debugging
  useEffect(() => {
    console.log("Active Projects:", activeProjects);
    console.log("Formatted Sections:", formattedSections);
    console.log("Available Categories:", categories);
  }, [activeProjects, formattedSections, categories]);

  const handleSectionClick = (sectionId) => {
    navigate(`/Faculty/ActiveWorks/Incharge/${sectionId}`);
  };

  return (
    <div className="flex justify-center p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#9b1a31]" />
            Active Projects
          </h1>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
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
          {categories.map(category => {
            const TypeIcon = getTypeIcon(category);
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-2.5 rounded-lg capitalize font-medium transition-all duration-200 flex items-center gap-2
                  ${selectedCategory === category
                    ? 'bg-[#9b1a31] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
                  }
                `}
              >
                {TypeIcon && <TypeIcon className="w-4 h-4" />}
                {category}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>Error loading projects: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredSections.length === 0 && (
          <div className="bg-white border border-gray-200 text-gray-700 px-8 py-16 rounded-xl flex flex-col items-center justify-center shadow-sm">
            <AlertCircle className="w-12 h-12 mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">No active projects found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery || selectedCategory !== 'all' 
                ? "Try adjusting your search or filter criteria" 
                : "You don't have any active projects assigned to you yet"}
            </p>
          </div>
        )}

        {/* Project Grid */}
        {!isLoading && !error && filteredSections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map(section => {
              const TypeIcon = getTypeIcon(section.category);
              const StatusIcon = section.status === "Completed" ? CheckCircle2 : Clock;
              
              return (
                <div 
                  key={section.id} 
                  className="relative"
                  onClick={() => handleSectionClick(section.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSectionClick(section.id)}
                >
                  {/* Stacked card effect */}
                  <div className="absolute -bottom-4 left-4 w-full h-full bg-white rounded-xl shadow-sm"></div>
                  <div className="absolute -bottom-2 left-2 w-full h-full bg-white rounded-xl shadow-md"></div>
                  
                  <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200">
                    <div className="p-6">
                      <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {section.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-3 py-1 text-xs font-medium ${getTypeColor(section.category)} rounded-full flex items-center gap-1.5`}>
                            <TypeIcon className="w-3.5 h-3.5" />
                            {section.category}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${
                            section.status === "Completed" 
                              ? "bg-green-50 text-green-700" 
                              : "bg-yellow-50 text-yellow-700"
                          }`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {section.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4 flex-shrink-0 text-gray-500" />
                          <span className="break-words">{section.branch}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <School className="w-4 h-4 text-gray-500" />
                            <span>Year: {section.year}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className="w-4 h-4 text-gray-500" />
                            <span>Sem: {section.semester}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>Section: {section.section}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Started: {section.startDate}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-[#9b1a31]">{section.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div 
                              className="bg-[#9b1a31] rounded-full h-2.5 transition-all duration-300"
                              style={{ width: `${section.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 flex items-center gap-1.5">
                              <GraduationCap className="w-4 h-4 text-gray-500" />
                              Batch: {section.batch || "N/A"}
                            </span>
                            <span className="text-sm font-medium text-[#9b1a31] flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              {section.teamCount} Teams
                            </span>
                          </div>
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
    </div>
  );
};

export default InchargeActiveWorks; 