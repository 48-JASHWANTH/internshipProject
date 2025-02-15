import React, { useState } from 'react';
import { FaSearch, FaFilter, FaGithub, FaDownload, FaEye } from 'react-icons/fa';
import useArchivedProjectStore from '../../store/archivedProjectStore';
import { Link } from 'react-router-dom';

const ArchivedProjects = () => {
  const { archivedProjects } = useArchivedProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: 'all',
    type: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const years = ['all', '2023', '2022', '2021', '2020'];
  const projectTypes = ['all', 'CBP', 'Mini', 'Major'];

  const filteredProjects = archivedProjects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.teamMembers.some(member => member.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.facultyGuide.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = filters.year === 'all' || project.year === filters.year;
    const matchesType = filters.type === 'all' || project.type === filters.type;
    
    return matchesSearch && matchesYear && matchesType;
  });

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Archived Projects</h1>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, team members, or faculty..."
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
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  {projectTypes.map(type => (
                    <option key={type} value={type}>Type: {type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                    {project.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    Completed: {new Date(project.completionDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Team:</span> {project.teamMembers.join(", ")}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Guide:</span> {project.facultyGuide}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link
                    to={`/Student/ArchivedProjects/${project.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#7d152a] transition-colors"
                  >
                    <FaEye size={14} />
                    View Details
                  </Link>
                  
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                  
                  {project.documents.length > 0 && (
                    <a
                      href={project.documents[0].url}
                      download
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      <FaDownload size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${currentPage === page
                    ? 'bg-[#9b1a31] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedProjects;
