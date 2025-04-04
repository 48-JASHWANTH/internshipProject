import React, { useState, useMemo, useEffect } from 'react';
import { FaSearch, FaGithub, FaGoogleDrive, FaEye, FaUsers, FaClipboardCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/useStore';

const ArchivedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Get user and archived projects from store
  const { 
    user,
    archivedProjects, 
    loading, 
    error, 
    fetchArchivedProjects 
  } = useStore();

  // Fetch archived projects on component mount
  useEffect(() => {
    if (user?.studentID && !archivedProjects) {
      fetchArchivedProjects(user.studentID);
    }
  }, [user?.studentID, fetchArchivedProjects, archivedProjects]);

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

  // Get unique categories from projects
  const availableCategories = useMemo(() => {
    if (!archivedProjects) return ['all'];

    const categories = new Set(['all']);
    archivedProjects.forEach(project => {
      if (project.projectDetails.projectType) {
        categories.add(project.projectDetails.projectType);
      }
    });
    return Array.from(categories);
  }, [archivedProjects]);

  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    if (!archivedProjects) return [];

    return archivedProjects.filter(project => {
      const workCategory = project.projectDetails.projectType?.toLowerCase() || '';
      const categoryMatch = selectedCategory === 'all' || 
        workCategory === selectedCategory.toLowerCase() ||
        (selectedCategory.toLowerCase() === 'course based project' && 
         (workCategory.includes('cbp') || workCategory.includes('course based')));

      const searchMatch = 
        project.projectDetails.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.teamDetails.members.some(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return searchMatch && categoryMatch;
    });
  }, [archivedProjects, searchTerm, selectedCategory]);

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading archived projects...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Archived Projects
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by project name or team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map(project => (
            <div 
              key={project.teamId} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="p-5">
                {/* Project Header with Title and Type */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 pr-4">
                    {project.projectDetails.projectTitle}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getTypeColor(project.projectDetails.projectType)}`}>
                    {project.projectDetails.projectType}
                  </span>
                </div>

                {/* Project Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <span className="w-24 text-sm font-medium">Guide:</span>
                    <span className="text-sm">{project.facultyDetails.guide?.name || 'Not Assigned'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-24 text-sm font-medium">Incharge:</span>
                    <span className="text-sm">{project.facultyDetails.inchargeFaculty?.name || 'Not Assigned'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.teamDetails.members.length} members</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClipboardCheck className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {project.workDetails.reviews.guideReviews.length + project.workDetails.reviews.inchargeReviews.length} reviews
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200">
                  <Link
                    to={`/Student/ArchivedProjects/${project.teamId}`}
                    className="w-40 flex items-center justify-center gap-1 px-2 py-1.5 bg-[#9b1a31] text-white rounded hover:bg-[#82001A] transition-colors text-s"
                  >
                    <FaEye size={15} />
                    <span>View Details</span>
                  </Link>
                  
                  <div className="flex-1 flex justify-center gap-2">
                    {project.projectDetails.githubURL && (
                      <a
                        href={project.projectDetails.githubURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                        title="GitHub Repository"
                      >
                        <FaGithub size={30} />
                      </a>
                    )}
                    
                    {project.projectDetails.googleDriveLink && (
                      <a
                        href={project.projectDetails.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                        title="Google Drive"
                      >
                        <FaGoogleDrive size={30} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for filtered results */}
        {currentProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No archived projects found matching your criteria</p>
          </div>
        )}

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
