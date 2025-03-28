import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User } from 'lucide-react';

const ActiveWorks = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeColor = (type) => {
    switch (type) {
      case "Major": return "bg-purple-100 text-purple-700";
      case "Mini": return "bg-indigo-100 text-indigo-700";
      case "FP": return "bg-blue-100 text-blue-700";
      case "CBP": return "bg-teal-100 text-teal-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  // Static data
  const activeWorks = [
    {
      id: 1,
      title: "E-Learning Platform",
      category: "Major",
      status: "In Progress",
      startDate: "2024-01-15",
      progress: 75,
      guide: "Dr. Sarah Johnson",
      batch: "2022-2026",
      teamSize: 4
    },
    {
      id: 2,
      title: "Library Management System",
      category: "Mini",
      status: "In Progress",
      startDate: "2024-02-01",
      progress: 45,
      guide: "Dr. Michael Brown",
      batch: "2022-2026",
      teamSize: 3
    }
  ];

  const categories = ['all', 'CBP', 'Mini', 'Major'];

  // Memoized filtered works
  const filteredWorks = useMemo(() => {
    return activeWorks.filter(work => 
      (selectedCategory === 'all' || work.category === selectedCategory) &&
      (work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       work.guide.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeWorks, selectedCategory, searchQuery]);

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
            placeholder="Search by project title or guide..."
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
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleProjectClick(work.id)}
              >
                <div className="p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {work.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-medium ${getTypeColor(work.category)} rounded-full`}>
                        {work.category}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                        {work.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>Guide: {work.guide}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {work.startDate}</span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-[#9b1a31]">{work.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                          style={{ width: `${work.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Batch: {work.batch}
                        </span>
                        <span className="text-sm font-medium text-[#9b1a31]">
                          {work.teamSize} Members
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

export default ActiveWorks;
