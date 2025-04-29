import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useStore } from '../../store/useStore';
import { FaSearch, FaSpinner, FaFilter } from 'react-icons/fa';
import { apiClient } from '@/lib/api-client';

function CampusProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    projectType: '',
    status: '',
    batch: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { baseUrl } = useStore();

  // Extract unique options for filters
  const filterOptions = {
    projectType: [...new Set(projects.map(p => p.projectType))],
    status: [...new Set(projects.map(p => p.status ? 'Active' : 'Inactive'))],
    batch: [...new Set(projects.map(p => p.batch).filter(Boolean))]
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('common/projects');
        if (response.data.success) {
          setProjects(response.data.projects);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [baseUrl]);

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      projectType: '',
      status: '',
      batch: ''
    });
  };

  // Apply filters and search
  const filteredProjects = projects.filter(project => {
    // Apply search filter
    const matchesSearch = 
      project.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply dropdown filters
    const matchesProjectType = !filters.projectType || project.projectType === filters.projectType;
    const matchesStatus = !filters.status || 
      (filters.status === 'Active' && project.status) || 
      (filters.status === 'Inactive' && !project.status);
    const matchesBatch = !filters.batch || project.batch === filters.batch;
    
    return matchesSearch && matchesProjectType && matchesStatus && matchesBatch;
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Campus Projects</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg flex-shrink-0 ${showFilters ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <FaFilter />
          </button>
        </div>
      </div>

      {/* Filter section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select
                className="border rounded-lg p-2 w-full sm:min-w-[150px]"
                value={filters.projectType}
                onChange={(e) => handleFilterChange('projectType', e.target.value)}
              >
                <option value="">All Types</option>
                {filterOptions.projectType.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="border rounded-lg p-2 w-full sm:min-w-[150px]"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                {filterOptions.status.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <select
                className="border rounded-lg p-2 w-full sm:min-w-[150px]"
                value={filters.batch}
                onChange={(e) => handleFilterChange('batch', e.target.value)}
              >
                <option value="">All Batches</option>
                {filterOptions.batch.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 mt-2 sm:mt-0 w-full sm:w-auto"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <div key={project.teamId} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 truncate">{project.projectTitle}</h2>
              
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                  {project.projectType}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                {project.projectOverview || "No overview available"}
              </p>
              
              <div className="text-xs sm:text-sm text-gray-500 mt-auto">
                <div className="truncate">Project ID: {project.teamId}</div>
                <div>Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CampusProjects; 