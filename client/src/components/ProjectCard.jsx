import React from 'react';
import { FaUser, FaClock, FaTag } from 'react-icons/fa';
import { ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, type, onAction }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 relative">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.skills?.map((skill) => (
          <span key={skill} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <FaUser className="text-gray-400" />  
          <span className="text-sm text-gray-600">{project.faculty || project.team?.join(', ')}</span>
        </div>
        
        {type === 'forum' && (
          <button
            onClick={() => onAction(project.id)}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded hover:bg-[#7a1426] transition-colors"
            aria-label="Express Interest"
          >
            Express Interest
          </button>
        )}
      </div>
      
      {/* Arrow Icon positioned in the top right corner */}
      <ArrowRight className="absolute top-4 right-4 w-6 h-6 text-[#82001A] transition-transform duration-200" />
    </div>
  );
};

export default ProjectCard; 