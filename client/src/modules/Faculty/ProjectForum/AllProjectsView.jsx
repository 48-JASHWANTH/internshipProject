import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, BookOpen, Tag, Users, Award, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  'Open': 'bg-green-100 text-green-800 border-green-200',
  'Close': 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  'Open': <CheckCircle className="w-4 h-4 mr-1" />,
  'Close': <XCircle className="w-4 h-4 mr-1" />
};

const AllProjectsView = ({ searchQuery, filters }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:1544/forum-projects/get-all-forumProjects',
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setProjects(response.data.projects);
        } else {
          toast.error(response.data.message || 'Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching all projects:', error);
        toast.error(error.response?.data?.message || 'An error occurred while fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.Title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filters.domain === 'all' || project.Domain === filters.domain;
    const matchesStatus = filters.status === 'all' || project.Status === filters.status;
    const matchesTechStack = filters.techStack === 'all' || 
      (project.TechStack && project.TechStack.includes(filters.techStack));
    return matchesSearch && matchesDomain && matchesStatus && matchesTechStack;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#82001A] mb-4" />
        <p className="text-gray-600 font-medium">Loading projects...</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex flex-col items-center">
          <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No projects found matching your criteria.</p>
          <p className="text-gray-400">Try adjusting your filters or search query.</p>
        </div>
      </div>
    );
  }

  return (
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center border ${
                statusColors[project.Status]
              }`}>
                {statusIcons[project.Status]}
                {project.Status}
              </span>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#82001A]" />
                <span className="text-gray-600 text-xs">Domain:</span>
                <span className="text-gray-800 font-medium text-xs">{project.Domain}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#82001A]" />
                <span className="text-gray-600 text-xs">Faculty:</span>
                <span className="text-gray-800 font-medium text-xs">{project.facultyId}</span>
              </div>
              
              <div className="flex items-center gap-2 col-span-2">
                <Users className="w-4 h-4 text-[#82001A]" />
                <span className="text-gray-600 text-xs">Interested Students:</span>
                <span className="text-[#82001A] font-medium text-xs">{project.InterestedStudents?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllProjectsView; 