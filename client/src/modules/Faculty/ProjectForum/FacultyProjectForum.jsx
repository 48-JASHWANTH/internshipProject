import React, { useState } from "react";
import { FaSearch, FaFilter, FaPlus, FaArrowRight } from "react-icons/fa";
import AddProjectModal from './AddProjectModal';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ["All", "Web", "Mobile", "AI/ML", "IoT"];
const PROJECT_STATUS = ["Open", "Closed"];

const PROJECTS = [
  {
    id: 1,
    title: "AI-Powered Healthcare System",
    description: "Developing an intelligent system for early disease detection using machine learning algorithms.",
    domain: "AI/ML",
    techStack: ["Python", "TensorFlow", "React", "Node.js"],
    facultyName: "Dr. Sarah Johnson",
    status: "Open"
  },
  {
    id: 2,
    title: "Smart Home IoT Platform for Energy Management",
    description: "Building a comprehensive IoT platform for home automation and energy management.",
    domain: "IoT",
    techStack: ["Arduino", "React", "MQTT", "MongoDB"],
    facultyName: "Dr. Michael Chen",
    status: "Open" 
  },
  {
    id: 3,
    title: "Tools for remote project collaboration",
    description: "Creating tools to enhance remote project collaboration efficiency.",
    domain: "Web",
    techStack: ["React", "Node.js", "Socket.io"],
    facultyName: "Dr. Emily Wilson",
    status: "Closed"
  },
  {
    id: 4,
    title: "Evaluating project innovation and creativity",
    description: "Developing metrics for assessing innovation in student projects.",
    domain: "Web",
    techStack: ["React", "Python", "Django"],
    facultyName: "Dr. Robert Brown",
    status: "Open"
  }
];

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'Closed': 'bg-red-100 text-red-800',
};

const ProjectForum = () => {
  const [viewMode, setViewMode] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleStatusChange = (projectId, newStatus) => {
    // In a real app, this would update the backend
    console.log(`Updating project ${projectId} status to ${newStatus}`);
  };

  const handleArrowClick = (e, projectId) => {
    e.stopPropagation(); // Prevent the card click event from firing
    if (viewMode === "my-projects") {
      navigate(`/Faculty/ProjectForum/${projectId}`);
    }
  };

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.domain === selectedCategory;
    const matchesView = viewMode === "all" ? true : project.facultyName === "Dr. Sarah Johnson"; // Replace with actual faculty name
    return matchesSearch && matchesCategory && matchesView;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Project Forum</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition"
        >
          <FaPlus className="text-sm" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <FaFilter className="text-gray-600" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "all"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setViewMode("my-projects")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "my-projects"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Projects
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="font-medium mb-3">Filter by Domain</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold text-black">{project.title}</h2>
              {viewMode === "my-projects" && (
                <button 
                  onClick={(e) => handleArrowClick(e, project.id)}
                  className="py-2 px-6 text-[#82001A] hover:text-[#6b0015] transition"
                >
                  <FaArrowRight />
                </button>
              )}
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack?.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-gray-100 text-sm text-gray-700 rounded">
                  {tech}
                </span>
              ))}
            </div>
            
            {viewMode === "my-projects" && (
              <div className="flex justify-start mb-4">
                <select
                  onChange={(e) => handleStatusChange(project.id, e.target.value)}
                  defaultValue={project.status}
                  className="px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-[#82001A] focus:border-transparent"
                >
                  {PROJECT_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-auto">
              {viewMode === "all" && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600 text-sm">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    statusColors[project.status === "Open" ? "Open" : "Closed"]
                  }`}>
                    {project.status === "Open" ? "Open" : "Closed"}
                  </span>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Faculty:</span>
                  <span className="text-[#82001A] font-medium">{project.facultyName}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddProjectModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ProjectForum; 