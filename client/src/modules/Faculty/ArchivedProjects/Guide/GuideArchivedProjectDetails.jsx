import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaGoogleDrive, FaUsers, FaClipboardCheck, FaArrowLeft } from 'react-icons/fa';
import { Calendar, CheckCircle } from 'lucide-react';

// Add this at the top with other constants
const satisfactionColors = {
  'Excellent': 'bg-purple-100 text-purple-800',
  'Very Good': 'bg-blue-100 text-blue-800', 
  'Good': 'bg-yellow-100 text-yellow-800',
  'Fair': 'bg-orange-100 text-orange-800',
  'Poor': 'bg-red-100 text-red-800'
};

// Assuming you have the staticProjects array available here
const staticProjects = [
  {
    projectId: 1,
    title: "AI-Powered Chat Assistant",
    type: "CBP",
    department: "CSBS",
    section: "A",
    batch: "2022-2026",
    teamSize: 4,
    reviewsConducted: 5,
    status: "completed",
    facultyGuide: "Dr. Sarah Johnson",
    completionDate: "2024-03-22",
    teamMembers: [
      { id: 1, name: "John Smith", regNo: "22B81A5D01", role: "Team Lead" },
      { id: 2, name: "Emma Davis", regNo: "22B81A5D02", role: "Developer" },
      { id: 3, name: "Michael Brown", regNo: "22B81A5D03", role: "Developer" },
      { id: 4, name: "Sarah Wilson", regNo: "22B81A5D04", role: "Documentation" }
    ],
    githubLink: "https://github.com/project1",
    driveLink: "https://drive.google.com/project1",
    description: "An AI-powered chat assistant that helps students with their queries using natural language processing.",
    technologies: ["React", "Node.js", "MongoDB", "OpenAI API"],
    objectives: [
      "Implement natural language processing",
      "Create user-friendly interface",
      "Integrate with college database",
      "Ensure data privacy and security"
    ],
    outcomes: [
      "Successfully deployed chat assistant",
      "Achieved 95% accuracy in query resolution",
      "Reduced support ticket volume by 60%",
      "Positive user feedback from students"
    ],
    reviews: [
      {
        id: 1,
        reviewName: "Abstract Review",
        date: "2024-01-15",
        phase: "Review 1",
        satisfactionLevel: "Excellent",
        remarks: "Well structured abstract",
        feedback: "Excellent progress on core functionality. The team has demonstrated excellent understanding of the project scope. The abstract clearly outlines the problem statement, methodology, and expected outcomes.",
        status: "reviewed"
      },
      {
        id: 2,
        reviewName: "Design Review",
        date: "2024-02-15",
        phase: "Review 2",
        satisfactionLevel: "Very Good",
        remarks: "Well designed architecture",
        feedback: "Great improvements in UI/UX. The design patterns are well thought out and implementation is clean.",
        status: "reviewed"
      },
      {
        id: 3,
        reviewName: "Final Review",
        date: "2024-03-15",
        phase: "Final Review",
        satisfactionLevel: "Good",
        remarks: "Project completed successfully",
        feedback: "Outstanding final implementation. All requirements met and code is well documented.",
        status: "reviewed"
      }
    ]
  },
  // Add other projects here...
];

const GuideArchivedProjectDetails = () => {
  const { projectId } = useParams();
  
  // Find the project details based on projectId
  const projectDetails = staticProjects.find(project => project.projectId === parseInt(projectId));

  const [activeTab, setActiveTab] = useState('overview');

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-yellow-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/Faculty/ArchivedProjects/Guide"
            className="flex items-center gap-2 text-gray-600 hover:text-[#9b1a31]"
          >
            <FaArrowLeft />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Title and Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {projectDetails.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                  Completed
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={projectDetails.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded"
              >
                <FaGithub size={30} />
              </a>
              <a
                href={projectDetails.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-[#9b1a31] hover:bg-gray-50 rounded"
              >
                <FaGoogleDrive size={30} />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-6">
          <TabButton tab="overview" label="Overview" />
          <TabButton tab="team" label="Team" />
          <TabButton tab="reviews" label="Reviews" />
          <TabButton tab="outcomes" label="Outcomes" />
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Department:</span>
                      <span className="text-sm">{projectDetails.department}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Section:</span>
                      <span className="text-sm">{projectDetails.section}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Batch:</span>
                      <span className="text-sm">{projectDetails.batch}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-32 text-sm font-medium">Completed On:</span>
                      <span className="text-sm">{projectDetails.completionDate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectDetails.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Project Description</h3>
                <p className="text-gray-600">{projectDetails.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Objectives</h3>
                <ul className="list-disc list-inside space-y-2">
                  {projectDetails.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-600">{objective}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectDetails.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-500">{member.regNo}</p>
                        <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Review History</h3>
              <div className="space-y-4">
                {projectDetails.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.reviewName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${satisfactionColors[review.satisfactionLevel]}`}>
                        {review.satisfactionLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Remarks</h4>
                        <p className="mt-1 text-sm text-gray-600">{review.remarks}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Detailed Feedback</h4>
                        <p className="mt-1 text-sm text-gray-600">{review.feedback}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Reviewed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'outcomes' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Project Outcomes</h3>
              <div className="space-y-4">
                {projectDetails.outcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-sm">
                      ✓
                    </div>
                    <p className="text-gray-700">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideArchivedProjectDetails; 