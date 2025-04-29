import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaPlus, FaArrowRight } from "react-icons/fa";
import AddProjectModal from './AddProjectModal';
import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { useStore } from '@/store/useStore';
import { Loader2, BookOpen, Tag, Users, Award, CheckCircle, XCircle, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AllProjectsView from './AllProjectsView';

const CATEGORIES = ["All", "Web", "Mobile", "AI/ML", "IoT", "Blockchain", "Cloud Computing", "Cybersecurity", "Data Science"];
const PROJECT_STATUS = ["Open", "Close"];
const TECH_STACKS = ["Python", "TensorFlow", "React", "Node.js", "Arduino", "MQTT", "MongoDB", "Socket.io", "Django"];

const statusColors = {
  'Open': 'bg-green-100 text-green-800 border-green-200',
  'Close': 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  'Open': <CheckCircle className="w-4 h-4 mr-1" />,
  'Close': <XCircle className="w-4 h-4 mr-1" />
};

const ProjectForum = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const [viewMode, setViewMode] = useState(tabParam === 'my-projects' ? 'my-projects' : 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    domain: 'all',
    status: 'all',
    techStack: 'all'
  });
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useStore();
  const navigate = useNavigate();

  const fetchMyProjects = async () => {
    if (!user?.facultyID) {
      toast.error('Faculty ID not found');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiClient.get(
        `forum-projects/${user.facultyID}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setMyProjects(response.data.projects);
      } else {
        toast.error(response.data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(error.response?.data?.message || 'An error occurred while fetching projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "my-projects") {
      fetchMyProjects();
    }
  }, [viewMode, user?.facultyID]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const response = await apiClient.put(
        `forum-projects/${projectId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('Project status updated successfully');
        // Refresh the projects list
        fetchMyProjects();
      } else {
        toast.error(response.data.message || 'Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating project status');
    }
  };

  const handleArrowClick = (e, projectId) => {
    e.stopPropagation(); // Prevent the card click event from firing
    if (viewMode === "my-projects") {
      navigate(`/Faculty/ProjectForum/${projectId}`);
    }
  };

  const handleProjectAdded = (newProject) => {
    // Refresh the projects list after adding a new project
    fetchMyProjects();
  };

  const filteredProjects = myProjects.filter(project => {
    const matchesSearch = project.Title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filters.domain === 'all' || project.Domain === filters.domain;
    const matchesStatus = filters.status === 'all' || project.Status === filters.status;
    const matchesTechStack = filters.techStack === 'all' || 
      (project.TechStack && project.TechStack.includes(filters.techStack));
    return matchesSearch && matchesDomain && matchesStatus && matchesTechStack;
  });

  const resetFilters = () => {
    setFilters({
      domain: 'all',
      status: 'all',
      techStack: 'all'
    });
    setSearchQuery('');
  };
  useEffect(() => {
    // Update viewMode if the URL query parameter changes
    if (tabParam === 'my-projects') {
      setViewMode('my-projects');
    }
  }, [tabParam]);
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 relative">
          Project Forum
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-[#82001A] rounded-full"></span>
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-[#82001A] outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(filters.domain !== 'all' || filters.status !== 'all' || filters.techStack !== 'all') && (
                  <span className="w-5 h-5 bg-[#82001A] text-white rounded-full text-xs flex items-center justify-center">
                    {Object.values(filters).filter(v => v !== 'all').length}
                  </span>
                )}
              </button>
              
              {(filters.domain !== 'all' || filters.status !== 'all' || filters.techStack !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <X className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <select
                  value={filters.domain}
                  onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-[#82001A] outline-none"
                >
                  <option value="all">All Domains</option>
                  {CATEGORIES.filter(cat => cat !== 'All').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-[#82001A] outline-none"
                >
                  <option value="all">All Statuses</option>
                  {PROJECT_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                <select
                  value={filters.techStack}
                  onChange={(e) => setFilters({ ...filters, techStack: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-[#82001A] outline-none"
                >
                  <option value="all">All Tech Stacks</option>
                  {TECH_STACKS.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === "all"
                ? "bg-[#82001A] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setViewMode("my-projects")}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === "my-projects"
                ? "bg-[#82001A] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Projects
          </button>
        </div>
        {viewMode === "my-projects" && (
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition shadow-md"
          >
            <FaPlus className="text-sm" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {viewMode === "all" ? (
        <AllProjectsView 
          searchQuery={searchQuery} 
          filters={filters} 
        />
      ) : (
        <>
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#82001A] mb-4" />
              <p className="text-gray-600 font-medium">Loading your projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex flex-col items-center">
                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-4">You haven't created any projects yet.</p>
                <button
                  onClick={handleOpenModal}
                  className="px-6 py-3 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition shadow-md flex items-center gap-2"
                >
                  <FaPlus className="text-sm" />
                  Create Your First Project
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.projectId} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-[#82001A] transition-colors">
                        {project.Title}
                      </h2>
                      <button 
                        onClick={(e) => handleArrowClick(e, project.projectId)}
                        className="p-2 text-[#82001A] hover:text-white hover:bg-[#82001A] rounded-full transition-colors"
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{project.Description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.TechStack?.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-gray-50 text-xs text-gray-700 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-2">Status</label>
                      <select
                        onChange={(e) => handleStatusChange(project.projectId, e.target.value)}
                        defaultValue={project.Status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#82001A] focus:border-transparent text-sm"
                      >
                        {PROJECT_STATUS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center border ${
                        statusColors[project.Status]
                      }`}>
                        {statusIcons[project.Status]}
                        {project.Status}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#82001A]" />
                        <span className="text-gray-600 text-xs">Interested Students:</span>
                        <span className="text-[#82001A] font-medium text-xs">{project.InterestedStudents?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onProjectAdded={handleProjectAdded}
      />
    </div>
  );
};

export default ProjectForum;