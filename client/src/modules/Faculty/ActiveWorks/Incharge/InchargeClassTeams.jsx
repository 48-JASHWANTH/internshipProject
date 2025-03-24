import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Calendar, User, ArrowLeft, ChevronRight } from 'lucide-react';

const InchargeClassTeams = () => {
  const navigate = useNavigate();
  const { classSection } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Updated Mock data with team numbers
  const teamsData = [
    {
      id: 1,
      teamNo: "01", // Added team number
      teamName: "Team Alpha",
      projectTitle: "AI-Powered Healthcare System",
      category: "CBP",
      status: "In Progress",
      startDate: "2024-01-15",
      teamSize: 4,
      guide: "Dr. Sarah Johnson",
      section: "CSE-A",
      progress: 75  // Add progress
    },
    {
      id: 2,
      teamNo: "02", // Added team number
      teamName: "Team Beta",
      projectTitle: "Smart City Planning",
      category: "CBP",
      status: "In Progress",
      startDate: "2024-01-20",
      teamSize: 3,
      guide: "Dr. Michael Brown",
      section: "CSE-A",
      progress: 60  // Add progress
    },
    // Add more teams as needed
  ];

  const filteredTeams = useMemo(() => {
    return teamsData.filter(team => 
      team.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teamsData, searchQuery]);

  const handleTeamClick = (teamId) => {
    navigate(`/Faculty/ActiveWorks/Incharge/${classSection}/${teamId}`);
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/Faculty/ActiveWorks/Incharge')}
            className="hover:text-[#9b1a31] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{classSection}</span>
        </nav>

        {/* Centered Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{classSection} Teams</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by team name or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => (
            <div 
              key={team.id}
              onClick={() => handleTeamClick(team.id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleTeamClick(team.id)}
            >
              <div className="p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {team.teamNo} - {team.projectTitle}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">
                      {team.category}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                      {team.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <User className="w-4 h-4" />
                    <span>Team Size: {team.teamSize}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Started: {team.startDate}</span>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-[#9b1a31]">{team.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                        style={{ width: `${team.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Guide: {team.guide}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InchargeClassTeams; 