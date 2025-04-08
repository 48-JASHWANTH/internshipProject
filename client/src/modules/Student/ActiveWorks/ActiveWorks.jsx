import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';

const ActiveWorks = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCategories, setAvailableCategories] = useState(['all']);
  const [projects, setProjects] = useState([]);
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTypeColor = (type) => {
    const normalizedType = type?.toLowerCase() || '';
    switch (normalizedType) {
      case "major project": return "bg-purple-100 text-purple-800";
      case "mini project": return "bg-indigo-100 text-indigo-800";
      case "field project": return "bg-blue-100 text-blue-800";
      case "course based project": 
      case "cbp":
      case "course based": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Fetch active works directly from API
  useEffect(() => {
    const fetchActiveWorks = async () => {
      if (!user?.studentID) return;
      
      try {
        setLoading(true);
        const response = await apiClient.get(`/student/activeworks/${user.studentID}`, {
          withCredentials: true
        });
        
        if (response.data.success && response.data.activeProjects) {
          const transformedProjects = response.data.activeProjects.map(project => ({
            id: project.teamId,
            title: project.projectDetails.projectTitle,
            category: project.projectDetails.projectType,
            status: project.projectDetails.projectStatus,
            startDate: new Date(project.projectDetails.startDate).toLocaleDateString(),
            progress: calculateProgress(project.workDetails.tasks),
            guide: project.facultyDetails.guide?.name || 'Not Assigned',
            guideEmail: project.facultyDetails.guide?.email,
            teamSize: project.teamDetails.members.length,
            techStack: project.projectDetails.techStack || [],
            lastReviewDate: project.workDetails.reviews.lastReviewDate 
              ? new Date(project.workDetails.reviews.lastReviewDate).toLocaleDateString()
              : 'No reviews yet',
            // Keep full details for project page
            workDetails: project.workDetails,
            projectDetails: project.projectDetails,
            facultyDetails: project.facultyDetails,
            teamDetails: project.teamDetails
          }));
          
          setProjects(transformedProjects);

          // Update available categories
          const categories = ['all'];
          const uniqueCategories = new Set(transformedProjects.map(p => p.category).filter(Boolean));
          categories.push(...uniqueCategories);
          setAvailableCategories(categories);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching active works:', error);
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveWorks();
  }, [user?.studentID]);

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const workCategory = project.category?.toLowerCase() || '';
    const categoryMatch = selectedCategory === 'all' || 
      workCategory === selectedCategory.toLowerCase() ||
      (selectedCategory.toLowerCase() === 'course based project' && 
       (workCategory.includes('cbp') || workCategory.includes('course based')));

    const searchMatch = 
      (project.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (project.guide?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const handleProjectClick = (projectId) => {
    navigate(`/Student/ActiveWorks/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Active Works</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by project title or guide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {availableCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-lg capitalize font-medium transition-all duration-200
                ${selectedCategory.toLowerCase() === category.toLowerCase()
                  ? 'bg-[#9b1a31] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              aria-label={`Filter by ${category} projects`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
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
                      {project.title || 'Untitled Project'}
                    </h3>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 text-xs font-medium ${getTypeColor(project.category)} rounded-full`}>
                        {project.category || 'Uncategorized'}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span title={project.guideEmail}>Guide: {project.guide}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {project.startDate}</span>
                    </div>

                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.techStack.map((tech, index) => (
                          <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

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
                          Last Review: {project.lastReviewDate}
                        </span>
                        <span className="text-sm font-medium text-[#9b1a31]">
                          {project.teamSize} Members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No projects found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate progress
const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => 
    task.status === 'done' || task.status === 'approved'
  ).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export default ActiveWorks;