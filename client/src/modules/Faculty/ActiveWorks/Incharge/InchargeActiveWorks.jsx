import React, { useState } from "react";
import { Search, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";


// Static data
const classesData = [
  { 
    id: 1, 
    className: "CSBS", 
    section: "A", 
    teams: 12, 
    type: "CBP",
    progress: 75,
    startDate: "2024-01-15",
    reviewsCompleted: 1,
    totalReviews: 3,
    nextReview: "2024-03-20"
  },
  { 
    id: 2, 
    className: "CSE", 
    section: "B", 
    teams: 15, 
    type: "Mini",
    progress: 60,
    startDate: "2024-01-20",
    reviewsCompleted: 2,
    totalReviews: 3,
    nextReview: "2024-03-25"
  },
  { 
    id: 3, 
    className: "ECE", 
    section: "C", 
    teams: 10, 
    type: "Major",
    progress: 45,
    startDate: "2024-01-25",
    reviewsCompleted: 1,
    totalReviews: 3,
    nextReview: "2024-03-30"
  },
];

const InchargeActiveWorks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'CBP', 'Mini', 'Major'];

  const filteredClasses = classesData.filter(
    (cls) =>
      (selectedCategory === 'all' || cls.type === selectedCategory) &&
      (cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
       cls.section.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCardClick = (cls) => {
    navigate(`/Faculty/ActiveWorks/Incharge/${cls.className}-${cls.section}`);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "CBP": return "bg-blue-50 text-blue-700";
      case "Mini": return "bg-green-50 text-green-700";
      case "Major": return "bg-purple-50 text-purple-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-center">
            ActiveWorks - Incharge
          </h1>
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

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
        {filteredClasses.map((cls) => (
          <div 
            key={cls.id} 
            className="relative"
            onClick={() => handleCardClick(cls)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCardClick(cls)}
          >
            {/* Stacked card effect with enhanced shadows */}
            <div className="absolute -bottom-4 left-4 w-full h-full bg-white rounded-lg shadow-sm"></div>
            <div className="absolute -bottom-2 left-2 w-full h-full bg-white rounded-lg shadow-md"></div>

            <div
              className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {cls.className}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(cls.type)}`}>
                      {cls.type}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                      In Progress
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <User className="w-4 h-4" />
                    <span>Section: {cls.section} ({cls.teams} teams)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Started: {cls.startDate}</span>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-[#9b1a31]">{cls.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Reviews: {cls.reviewsCompleted}/{cls.totalReviews}
                      </span>
                      <span className="text-sm font-medium text-yellow-600">
                        Next Review: {cls.nextReview}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InchargeActiveWorks; 