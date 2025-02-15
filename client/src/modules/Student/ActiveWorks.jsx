import React, { useState } from 'react';
import useProjectStore from '../../store/projectStore';
import ProjectCard from '../../components/ProjectCard';

const ActiveWorks = () => {
  const { activeWorks } = useProjectStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'CBP', 'Mini', 'Major'];

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Active Works</h1>
        
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
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeWorks
            .filter(work => selectedCategory === 'all' || work.category === selectedCategory)
            .map(work => (
              <div key={work.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <ProjectCard
                  project={work}
                  type="active"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveWorks;
