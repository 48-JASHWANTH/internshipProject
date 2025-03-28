import React, { useState, useMemo } from 'react';
import { FaSearch, FaFilter, FaGithub, FaGoogleDrive, FaEye, FaUsers, FaClipboardCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Static projects data
const staticProjects = [
  {
    id: 1,
    title: "AI-Powered Chat Assistant",
    type: "CBP",
    department: "CSBS",
    section: "A",
    batch: "2022-2026",
    teamSize: 4,
    reviewsConducted: 5,
    status: "completed",
    teamMembers: ["John Smith", "Emma Davis", "Michael Brown", "Sarah Wilson"],
    githubLink: "https://github.com/project1",
    driveLink: "https://drive.google.com/project1",
    guide: "Dr. Sarah Johnson",
    incharge: "Dr. Robert Wilson"
  },
  {
    id: 2,
    title: "Smart Healthcare System",
    type: "Major",
    department: "AIML",
    section: "B",
    batch: "2023-2027",
    teamSize: 3,
    reviewsConducted: 4,
    status: "completed",
    teamMembers: ["Alex Johnson", "Emily White", "James Brown"],
    githubLink: "https://github.com/project2",
    driveLink: "https://drive.google.com/project2",
    guide: "Dr. Michael Chen",
    incharge: "Dr. Emily Brooks"
  },
  {
    id: 3,
    title: "IoT Weather Station",
    type: "Mini",
    department: "IOT",
    section: "A",
    batch: "2024-2028",
    teamSize: 2,
    reviewsConducted: 3,
    status: "completed",
    teamMembers: ["David Lee", "Sophie Chen"],
    githubLink: "https://github.com/project3",
    driveLink: "https://drive.google.com/project3",
    guide: "Dr. James Anderson",
    incharge: "Dr. Lisa Taylor"
  },
  {
    id: 4,
    title: "Cybersecurity Analysis Tool",
    type: "Field Project",
    department: "CyS",
    section: "C",
    batch: "2022-2026",
    teamSize: 3,
    reviewsConducted: 4,
    status: "completed",
    teamMembers: ["Ryan Park", "Maria Garcia", "Tom Wilson"],
    githubLink: "https://github.com/project4",
    driveLink: "https://drive.google.com/project4",
    guide: "Dr. David Miller",
    incharge: "Dr. Sarah Thompson"
  },
  {
    id: 5,
    title: "Data Analytics Dashboard",
    type: "CBP",
    department: "AIDS",
    section: "A",
    batch: "2023-2027",
    teamSize: 4,
    reviewsConducted: 5,
    status: "completed",
    teamMembers: ["Chris Martin", "Anna Kim", "Peter Zhang", "Lisa Wang"],
    githubLink: "https://github.com/project5",
    driveLink: "https://drive.google.com/project5",
    guide: "Dr. Jennifer Lee",
    incharge: "Dr. Mark Anderson"
  }
];

const ArchivedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    batch: 'all',
    department: 'all',
    type: 'all',
    section: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const batchYears = ['all', '2022-2026', '2023-2027', '2024-2028', '2025-2029'];
  const projectTypes = ['all', 'CBP', 'Mini', 'Field Project', 'Major'];
  const departments = [
    'all',
    'CSE',
    'CSBS',
    'IT',
    'CSDS',
    'AIML',
    'IOT',
    'CyS',
    'AIDS'
  ];
  const sections = ['all', 'A', 'B', 'C', 'D'];

  // Filter completed projects
  const archivedProjects = useMemo(() => {
    return staticProjects.filter(project => project.status === 'completed');
  }, []);

  const filteredProjects = archivedProjects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.teamMembers?.some(member => 
        member.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesYear = filters.batch === 'all' || project.batch === filters.batch;
    const matchesType = filters.type === 'all' || project.type === filters.type;
    const matchesDepartment = filters.department === 'all' || project.department === filters.department;
    const matchesSection = filters.section === 'all' || project.section === filters.section;
    
    return matchesSearch && matchesYear && matchesType && matchesDepartment && matchesSection;
  });

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

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

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col gap-6">
            {/* Search Bar and Filter Toggle */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by project name, team members..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
                  onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Collapsible Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
                  onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
                >
                  <option value="all">All Batches</option>
                  {batchYears.filter(year => year !== 'all').map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                >
                  <option value="all">All Departments</option>
                  {departments.filter(dept => dept !== 'all').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
                  onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                >
                  <option value="all">All Sections</option>
                  {sections.filter(section => section !== 'all').map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>

                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="all">All Types</option>
                  {projectTypes.filter(type => type !== 'all').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map(project => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="p-5">
                {/* Project Header with Title and Type */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 pr-4">
                    {project.title}
                  </h3>
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium whitespace-nowrap">
                    {project.type}
                  </span>
                </div>

                {/* Project Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <span className="w-24 text-sm font-medium">Guide:</span>
                    <span className="text-sm">{project.guide}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-24 text-sm font-medium">Incharge:</span>
                    <span className="text-sm">{project.incharge}</span>
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
                    <span className="text-sm">{project.reviewsConducted} reviews</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200">
                  <Link
                    to={`/Student/ArchivedProjects/${project.id}`}
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
        {currentProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No archived projects found</p>
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
