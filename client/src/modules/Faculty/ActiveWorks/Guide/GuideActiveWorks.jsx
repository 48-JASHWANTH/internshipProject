import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User } from 'lucide-react';

const GuideActiveWorks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'FP', 'Mini', 'Major'];

  // Mock data - replace with actual data from your store
  const guidedProjects = [
    {
      id: 1,
      title: "AI-Powered Healthcare Diagnostic System",
      category: "Major",
      status: "In Progress",
      startDate: "2024-01-15",
      progress: 75,
      nextReview: "2024-03-20",
      teamSize: 4,
      section: "CSE-A",
      reviewsCompleted: 1,
      totalReviews: 3
    },
    // Add more projects as needed
  ];

  const filteredProjects = useMemo(() => {
    return guidedProjects.filter(project => 
      (selectedCategory === 'all' || project.category === selectedCategory) &&
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [guidedProjects, selectedCategory, searchQuery]);

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

        {/* Project Grid */}
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
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">
                      {project.category}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                      {project.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <User className="w-4 h-4" />
                    <span>Section: {project.section} ({project.teamSize} members)</span>
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
                        Reviews: {project.reviewsCompleted}/{project.totalReviews}
                      </span>
                      <span className="text-sm font-medium text-yellow-600">
                        Next Review: {project.nextReview}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideActiveWorks; 