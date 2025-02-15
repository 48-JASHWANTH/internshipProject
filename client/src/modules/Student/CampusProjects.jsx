import React, { useState } from 'react';
import useProjectStore from '../../store/projectStore';
import ProjectCard from '../../components/ProjectCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

const CampusProjects = () => {
  const { completedProjects } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: 'all',
    branch: 'all',
    category: 'all'
  });

  const years = ['all', '2023', '2022', '2021', '2020'];
  const branches = ['all', 'CSE', 'ECE', 'ME', 'CE'];
  const categories = ['all', 'web', 'mobile', 'ai/ml', 'iot'];

  const filteredProjects = completedProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filters.year === 'all' || project.year === filters.year;
    const matchesBranch = filters.branch === 'all' || project.branch === filters.branch;
    const matchesCategory = filters.category === 'all' || project.category === filters.category;
    return matchesSearch && matchesYear && matchesBranch && matchesCategory;
  });

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Campus Projects</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1a31] bg-gray-50"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <FaFilter className="text-gray-400" />
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1a31] bg-gray-50"
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>Year: {year}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1a31] bg-gray-50"
                  onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>Branch: {branch}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1a31] bg-gray-50"
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>Category: {category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <ProjectCard
                project={project}
                type="completed"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusProjects; 