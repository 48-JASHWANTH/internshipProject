import React, { useState } from "react";
import { FaSearch, FaFilter, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ProjectForumDetails from './ProjectForumDetails';
import { useStore } from '@/store/useStore';
const CATEGORIES = ["All", "Web", "Mobile", "AI/ML", "IoT"];
const PROJECT_STATUS = ["Open", "Closed"];
const TECH_STACKS = ["Python", "TensorFlow", "React", "Node.js", "Arduino", "MQTT", "MongoDB", "Socket.io", "Django"];

// Static project data for demonstration
const PROJECTS = [
  {
    title: "AI-Powered Healthcare System",
    description: "Developing an intelligent system for early disease detection using machine learning algorithms.",
    domain: "AI/ML",
    techStack: ["Python", "TensorFlow", "React", "Node.js"],
    facultyName: "Dr. Sarah Johnson",
    status: "Open"
  },
  {
    title: "Smart Home IoT Platform",
    description: "Building a comprehensive IoT platform for home automation and energy management.",
    domain: "IoT",
    techStack: ["Arduino", "MQTT", "React", "MongoDB"],
    facultyName: "Dr. Michael Chen",
    status: "Open"
  },
  {
    title: "Remote Collaboration Tools",
    description: "Creating tools to enhance remote project collaboration efficiency.",
    domain: "Web",
    techStack: ["React", "Node.js", "Socket.io"],
    facultyName: "Dr. Emily Wilson",
    status: "Closed"
  }
];

// Static data for interested projects
const INTERESTED_PROJECTS = [
  {
    id: "1",
    title: "Machine Learning for Climate Analysis",
    description: "Using ML algorithms to analyze climate patterns and predict environmental changes.",
    domain: "AI/ML",
    techStack: ["Python", "TensorFlow", "MongoDB"],
    facultyName: "Dr. Robert Brown",
    facultyId: "FAC123",
    facultyEmail: "robert.brown@university.edu",
    status: "Open",
    interestExpressedOn: "2024-03-15"
  },
];

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'Closed': 'bg-red-100 text-red-800',
};

const ProjectForum = () => {
  const [viewMode, setViewMode] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [projectToConfirm, setProjectToConfirm] = useState(null);
  const [interestedProjects, setInterestedProjects] = useState(INTERESTED_PROJECTS);
  const [filters, setFilters] = useState({
    domain: 'all',
    status: 'all',
    techStack: 'all'
  });
  const navigate = useNavigate();
  const { currentUser } = useStore();

  const handleArrowClick = (e, projectId) => {
    e.stopPropagation();
    navigate(`/Student/ProjectForum/${projectId}`);
  };

  const handleExpressInterest = (project) => {
    setProjectToConfirm(project);
  };

  const handleConfirmInterest = () => {
    if (projectToConfirm) {
      // Create a new interested project entry
      const newInterestedProject = {
        id: Date.now().toString(), // Generate a temporary ID
        ...projectToConfirm,
        interestExpressedOn: new Date().toISOString()
      };

      // Add the new project to interested projects
      setInterestedProjects(prev => [...prev, newInterestedProject]);

      // Log the interest details
      console.log("Interest Expression Details:", {
        student: {
          id: currentUser?.id || "STU001",
          name: currentUser?.name || "John Doe",
          email: currentUser?.email || "john.doe@university.edu",
          rollNo: currentUser?.rollNo || "20CS01",
          semester: currentUser?.semester || 6
        },
        project: {
          title: projectToConfirm.title,
          faculty: projectToConfirm.facultyName,
          domain: projectToConfirm.domain,
          expressedOn: new Date().toISOString()
        }
      });

      // Close the confirmation modal
      setProjectToConfirm(null);
    }
  };

  const filteredProjects = (viewMode === "all" ? PROJECTS : interestedProjects).filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filters.domain === 'all' || project.domain === filters.domain;
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesTechStack = filters.techStack === 'all' || project.techStack.includes(filters.techStack);
    return matchesSearch && matchesDomain && matchesStatus && matchesTechStack;
  });

  // Add this helper function before the return statement
  const isProjectInterested = (project) => {
    return interestedProjects.some(
      (interestedProject) => interestedProject.title === project.title
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Project Forum</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#82001A] focus:border-transparent"
          />
        </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaFilter className="text-gray-600" />
              <span className="text-gray-600">Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <select
                value={filters.domain}
                onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#82001A] focus:border-transparent"
              >
                <option value="all">All Domains</option>
                {CATEGORIES.filter(cat => cat !== "All").map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#82001A] focus:border-transparent"
              >
                <option value="all">All Status</option>
                {PROJECT_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filters.techStack}
                onChange={(e) => setFilters(prev => ({ ...prev, techStack: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#82001A] focus:border-transparent"
              >
                <option value="all">All Tech Stacks</option>
                {TECH_STACKS.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
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
            onClick={() => setViewMode("interested-projects")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "interested-projects"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Interested Projects
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div 
            key={viewMode === "interested-projects" ? project.id : project.title} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-black">{project.title}</h2>
              {viewMode === "interested-projects" && (
                <button 
                  onClick={(e) => handleArrowClick(e, project.id)}
                  className="text-[#82001A] transition-colors p-2"
                >
                  <FaArrowRight size={16} />
                </button>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack?.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full">
                  {tech}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Faculty:</span>
                  <span className="text-[#82001A] font-medium">{project.facultyName}</span>
                </div>
                {viewMode === "all" ? (
                  project.status === "Open" ? (
                    isProjectInterested(project) ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                      >
                        Interested
                      </button>
                    ) : (
                      <button
                        onClick={() => handleExpressInterest(project)}
                        className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition text-sm"
                      >
                        Express Interest
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                    >
                      Express Interest
                    </button>
                  )
                ) : (
                  <span className="text-xs text-gray-500">
                    Interested on {new Date(project.interestExpressedOn).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {projectToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Interest
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to express interest in "{projectToConfirm.title}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProjectToConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInterest}
                className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0016] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForum; 