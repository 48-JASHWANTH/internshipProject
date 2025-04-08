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
  Building2
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const GuideActiveWorks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { 
    user, 
    guidedProjects, 
    fetchGuidedProjects, 
    isLoading, 
    error 
  } = useStore();

  console.log(guidedProjects);

  useEffect(() => {
    const loadGuidedProjects = async () => {
      if (user?.facultyID) {
        const result = await fetchGuidedProjects(user.facultyID);
        if (!result.success) {
          toast.error(result.error || 'Failed to load guided projects');
        }
      }
    };

    loadGuidedProjects();
  }, [user, fetchGuidedProjects]);

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
      default: return BookOpen;
    }
  };

  const categories = ['all', 'Mini Project', 'Major Project', 'FP', 'CBP'];

  const formattedProjects = useMemo(() => {
    if (!guidedProjects?.teams) return [];
    
    // Filter to only include teams with status=false (in progress)
    return guidedProjects.teams
      .filter(team => team.status === false)
      .map(team => {
        // Calculate progress based on tasks
        const totalTasks = team.tasks?.length || 0;
        const completedTasks = team.tasks?.filter(task => 
          task.status === 'done' || task.status === 'approved'
        ).length || 0;
        
        // Calculate progress percentage
        const progress = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;
        
        // Calculate next review date (placeholder logic)
        const latestReview = team.reviews && team.reviews.length > 0 
          ? team.reviews.sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview))[0]
          : null;
        
        const nextReviewDate = latestReview 
          ? new Date(new Date(latestReview.dateOfReview).getTime() + 30 * 24 * 60 * 60 * 1000) 
          : new Date();
        
        return {
          id: team.teamId,
          title: team.projectTitle,
          category: team.projectType,
          status: "In Progress", // Always set to In Progress for active works
          startDate: format(new Date(team.createdAt), 'yyyy-MM-dd'),
          progress: progress, // Using the task-based progress calculation
          nextReview: format(nextReviewDate, 'yyyy-MM-dd'),
          teamSize: team.listOfStudents.length,
          section: team.section,
          branch: team.branch,
          sem: team.sem,
          year: team.year,
          reviewsCompleted: team.reviews?.length || 0,
          totalReviews: 5,
          batch: team.batch
        };
      });
  }, [guidedProjects]);

  const filteredProjects = useMemo(() => {
    return formattedProjects.filter(project => 
      (selectedCategory === 'all' || project.category === selectedCategory) &&
      (project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       project.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       project.branch?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [formattedProjects, selectedCategory, searchQuery]);

  const handleProjectClick = (projectId) => {
    navigate(`/Faculty/ActiveWorks/Guide/${projectId}`);
  };

  return (
    <div className="flex justify-center p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          <GraduationCap className="inline-block mr-2 mb-1 text-[#9b1a31]" size={32} />
          ActiveWorks - Guide
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by project title, section or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {categories.map(category => {
            const TypeIcon = category === 'all' ? null : getTypeIcon(category);
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
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-center shadow-sm">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="bg-white border border-gray-200 text-gray-700 px-8 py-16 rounded-xl flex flex-col items-center justify-center shadow-sm">
            <AlertCircle className="w-12 h-12 mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">No guided projects found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery || selectedCategory !== 'all' 
                ? "Try adjusting your search or filter criteria" 
                : "You don't have any guided projects assigned to you yet"}
            </p>
          </div>
        )}

        {/* Project Grid */}
        {!isLoading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => {
              const TypeIcon = getTypeIcon(project.category);
              const StatusIcon = project.status === "Completed" ? CheckCircle2 : Clock;
              
              return (
                <div 
                  key={project.id} 
                  onClick={() => handleProjectClick(project.id)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {project.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 text-xs font-medium ${getTypeColor(project.category)} rounded-full flex items-center gap-1.5`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {project.category}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${
                          project.status === "Completed" 
                            ? "bg-green-50 text-green-700" 
                            : "bg-yellow-50 text-yellow-700"
                        }`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {project.status}
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
                          <span>Sem: {project.sem}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>Section: {project.section}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Started: {project.startDate}</span>
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
    </div>
  );
};

export default GuideActiveWorks; 