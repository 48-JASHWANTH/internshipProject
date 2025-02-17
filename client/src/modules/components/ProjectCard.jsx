import React from 'react';
import { Calendar, User, BarChart, ArrowRight } from 'lucide-react';
import { FaUser } from 'react-icons/fa';

const ProjectCard = ({ project, type, onAction }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 relative">
      {/* Project Title - Added pr-10 to create space for arrow */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 pr-10">
        {project.title}
      </h3>

      {/* Project Category */}
      <div className="flex gap-2 mb-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
          {project.category}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium 
          ${project.progress >= 80 
            ? 'bg-green-100 text-green-800' 
            : project.progress >= 40 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
          {project.progress >= 80 
            ? 'Near Completion' 
            : project.progress >= 40 
              ? 'In Progress' 
              : 'Early Stages'}
        </span>
      </div>

      {/* Project Details */}
      <div className="space-y-2 text-gray-600">
        {/* Faculty Guide */}
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="text-sm">Guide: {project.facultyGuide}</span>
        </div>

        {/* Start Date */}
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Started: {project.startDate}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm">Progress</span>
            <span className="text-sm font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Arrow Icon positioned in the top right corner */}
      <ArrowRight className="absolute top-4 right-4 w-5 h-5 text-[#82001A] transition-transform duration-200" />
    </div>
  );
};

export default ProjectCard; 