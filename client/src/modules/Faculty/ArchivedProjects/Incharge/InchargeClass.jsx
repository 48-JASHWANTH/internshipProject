import React, { useState } from "react";
import { Search, User, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FaGithub, FaGoogleDrive, FaEye, FaUsers, FaClipboardCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

// Static data for demonstration
const projectsData = [
  {
    id: 1,
    teamNo: "01",
    title: "AI Chatbot Assistant",
    teamMembers: [
      { name: "John Smith", regNo: "22B81A5D01" },
      { name: "Emma Davis", regNo: "22B81A5D02" },
    ],
    type: "CBP",
    department: "CSBS",
    section: "A",
    batch: "2022-2026",
    reviewsCompleted: 3,
    totalReviews: 3,
    githubLink: "https://github.com/project1",
    driveLink: "https://drive.google.com/project1",
    status: "completed"
  },
  {
    id: 2,
    teamNo: "02",
    title: "Smart Healthcare Monitoring",
    teamMembers: [
      { name: "Alex Johnson", regNo: "22B81A5D03" },
      { name: "Sarah Wilson", regNo: "22B81A5D04" },
    ],
    type: "CBP",
    department: "CSBS",
    section: "A",
    batch: "2022-2026",
    reviewsCompleted: 3,
    totalReviews: 3,
    githubLink: "https://github.com/project2",
    driveLink: "https://drive.google.com/project2",
    status: "completed"
  },
  // Add more projects as needed
];

const InchargeClass = () => {
  const navigate = useNavigate();
  const { classSection } = useParams(); // Will be in format "CSBS-A"
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projectsData.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.teamMembers.some((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getTypeColor = (type) => {
    switch (type) {
      case "CBP":
        return "bg-blue-50 text-blue-700";
      case "Mini":
        return "bg-green-50 text-green-700";
      case "Major":
        return "bg-pure-50 text-purple-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6 relative">
        <button
          onClick={() => navigate("/Faculty/ArchivedProjects/Incharge")}
          className="absolute left-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold w-full text-center">
          {classSection} Projects
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search projects or team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div 
            key={project.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="p-5">
              {/* Project Title with Team Number */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {project.teamNo} - {project.title}
              </h3>

              {/* Project Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="w-24 text-sm font-medium">Department:</span>
                  <span className="text-sm">{project.department}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-24 text-sm font-medium">Section:</span>
                  <span className="text-sm">{project.section}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-24 text-sm font-medium">Batch:</span>
                  <span className="text-sm">{project.batch}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUsers className="w-4 h-4 mr-2" />
                  <span className="text-sm">{project.teamMembers.length} members</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClipboardCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm">{project.reviewsCompleted} reviews</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200">
                <Link
                  to={`/Faculty/ArchivedProjects/Incharge/${classSection}/${project.id}`}
                  className="w-40 flex items-center justify-center gap-1 px-2 py-1.5 bg-[#9b1a31] text-white rounded hover:bg-[#82001A] transition-colors text-s"
                >
                  <FaEye size={15} />
                  <span>View Details</span>
                </Link>
                
                <div className="flex-1 flex justify-center gap-2">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                    title="GitHub Repository"
                  >
                    <FaGithub size={30} />
                  </a>
                  
                  <a
                    href={project.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded transition-colors"
                    title="Google Drive"
                  >
                    <FaGoogleDrive size={30} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default InchargeClass; 