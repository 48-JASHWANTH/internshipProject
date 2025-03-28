import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, AlertCircle } from 'lucide-react';
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
      case "Major": return "bg-purple-100 text-purple-700";
      case "Mini": return "bg-indigo-100 text-indigo-700";
      case "FP": return "bg-blue-100 text-blue-700";
      case "CBP": return "bg-teal-100 text-teal-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const categories = ['all', 'Mini Project', 'Major Project', 'FP', 'CBP'];

  const formattedProjects = useMemo(() => {
    if (!guidedProjects?.teams) return [];
    
    return guidedProjects.teams.map(team => {
      // Find the latest review to determine progress
      const latestReview = team.reviews && team.reviews.length > 0 
        ? team.reviews.sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview))[0]
        : null;
      
      // Calculate progress percentage from the latest review's progress field
      let progressPercentage = 0;
      if (latestReview?.progress) {
        const progressStr = latestReview.progress;
        const match = progressStr.match(/(\d+)%?/);
        if (match) {
          progressPercentage = parseInt(match[1], 10);
        }
      }
      
      // Calculate next review date (placeholder logic)
      const nextReviewDate = latestReview 
        ? new Date(new Date(latestReview.dateOfReview).getTime() + 30 * 24 * 60 * 60 * 1000) 
        : new Date();
      
      return {
        id: team.teamId,
        title: team.projectTitle,
        category: team.projectType,
        status: team.status ? "Completed" : "In Progress",
        startDate: format(new Date(team.createdAt), 'yyyy-MM-dd'),
        progress: progressPercentage,
        nextReview: format(nextReviewDate, 'yyyy-MM-dd'),
        teamSize: team.listOfStudents.length,
        section: team.teamId.split('_')[0],
        reviewsCompleted: team.reviews?.length || 0,
        totalReviews: 5 // Placeholder - could be determined by project type
      };
    });
  }, [guidedProjects]);

  const filteredProjects = useMemo(() => {
    return formattedProjects.filter(project => 
      (selectedCategory === 'all' || project.category === selectedCategory) &&
      (project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       project.section.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [formattedProjects, selectedCategory, searchQuery]);

  const handleProjectClick = (projectId) => {
    navigate(`/Faculty/ActiveWorks/Guide/${projectId}`);
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ActiveWorks - Guide
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by project title or Section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-12 rounded-lg flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">No guided projects found</h3>
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
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                onClick={() => handleProjectClick(project.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
              >
                <div className="p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-medium ${getTypeColor(project.category)} rounded-full`}>
                        {project.category}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        project.status === "Completed" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>Section: {project.section} </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {project.startDate}</span>
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
                        <span className="text-sm font-medium text-[#9b1a31]">
                        {project.teamSize} Members
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
    </div>
  );
};

export default GuideActiveWorks; 