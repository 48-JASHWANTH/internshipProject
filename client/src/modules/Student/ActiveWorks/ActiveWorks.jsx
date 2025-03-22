import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ProjectCard from '../../../modules/components/ProjectCard';
import { Search } from 'lucide-react';

const ActiveWorks = () => {
  const navigate = useNavigate();
  // const {activeWorks,setActiveWorks} = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const activeWorks = [
        {
            id: 1,
            title: "E-Learning Platform",
            description: "Building a comprehensive learning management system",
            team: ["John Doe", "Jane Smith"],
            deadline: "2024-05-01",
            category: "Major",
            status: "In Progress"
        },
        {
            id: 2,
            title: "Library Management System",
            description: "Digital system for library resource management",
            team: ["Alice Brown"],
            deadline: "2024-03-15",
            category: "Mini",
            status: "Review"
        }]

  
  const categories = ['all', 'CBP', 'Mini', 'Major'];



  // Filter active projects only
  const activeWorksFiltered = useMemo(() => {
    return activeWorks
  }, [activeWorks]);

  // Memoized filtered works
  const filteredWorks = useMemo(() => {
    return activeWorksFiltered.filter(work => 
      (selectedCategory === 'all' || work.category === selectedCategory) &&
      (work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       work.facultyGuide.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeWorksFiltered, selectedCategory, searchQuery]);

  const handleProjectClick = (projectId) => {
    navigate(`/Student/ActiveWorks/${projectId}`);
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Active Works</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by project title or faculty..."
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
              aria-label={`Filter by ${category} projects`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.length > 0 ? (
            filteredWorks.map(work => (
              <div 
                key={work.id} 
                onClick={() => handleProjectClick(work.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleProjectClick(work.id)}
              >
                <ProjectCard
                  project={work}
                  type="active"
                />
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

export default ActiveWorks;
