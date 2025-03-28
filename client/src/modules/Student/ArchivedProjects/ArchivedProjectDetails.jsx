import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaGoogleDrive, FaUsers, FaClipboardCheck, FaArrowLeft } from 'react-icons/fa';
import { Calendar, CheckCircle } from 'lucide-react';

const satisfactionColors = {
  'Excellent': 'bg-purple-100 text-purple-800',
  'Very Good': 'bg-blue-100 text-blue-800', 
  'Good': 'bg-yellow-100 text-yellow-800',
  'Fair': 'bg-orange-100 text-orange-800',
  'Poor': 'bg-red-100 text-red-800'
};

// Static project details data
const staticProjectDetails = {
  id: 1,
  title: "AI-Powered Chat Assistant",
  type: "CBP",
  department: "CSBS",
  section: "A",
  batch: "2022-2026",
  teamSize: 4,
  reviewsConducted: 5,
  status: "completed",
  completionDate: "2024-03-22",
  description: "An AI-powered chat assistant that helps students with their queries using natural language processing. The system uses advanced machine learning algorithms to understand and respond to student questions accurately.",
  technologies: ["React", "Node.js", "MongoDB", "OpenAI API", "TensorFlow", "Python"],
  objectives: [
    "Implement natural language processing for accurate query understanding",
    "Create a user-friendly interface for easy interaction",
    "Integrate with college database for personalized responses",
    "Ensure data privacy and security compliance",
    "Implement real-time response capabilities"
  ],
  outcomes: [
    "Successfully deployed chat assistant with 95% accuracy",
    "Reduced support ticket volume by 60%",
    "Achieved 90% positive user feedback from students",
    "Successfully handled over 10,000 queries in the first month",
    "Implemented secure data handling protocols"
  ],
  guide: {
    name: "Dr. Sarah Johnson",
    department: "CSBS",
    email: "sarah.johnson@example.com",
    expertise: "AI & Machine Learning"
  },
  teamMembers: [
    {
      id: 1,
      name: "John Smith",
      regNo: "22B81A5D01",
      role: "Team Lead & Backend Developer"
    },
    {
      id: 2,
      name: "Emma Davis",
      regNo: "22B81A5D02",
      role: "Frontend Developer"
    },
    {
      id: 3,
      name: "Michael Brown",
      regNo: "22B81A5D03",
      role: "ML Engineer"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      regNo: "22B81A5D04",
      role: "Documentation & Testing"
    }
  ],
  reviews: {
    guideReviews: [
      {
        id: "g1",
        reviewName: "Initial Design Review",
        date: "2024-01-15",
        remarks: "Well-structured abstract with clear problem statement",
        feedback: "The team has demonstrated excellent understanding of the project scope. The abstract clearly outlines the problem statement, methodology, and expected outcomes. The proposed solution is innovative and addresses a real need.",
        satisfactionLevel: "Excellent",
        type: "faculty"
      },
      {
        id: "g2",
        reviewName: "Implementation Review",
        date: "2024-02-15",
        remarks: "Comprehensive system design",
        feedback: "The architectural design is well thought out. The team has considered scalability and security aspects. The database schema is properly normalized. Some minor improvements needed in the API documentation.",
        satisfactionLevel: "Very Good",
        type: "faculty"
      }
    ],
    inchargeReviews: [
      {
        id: "i1",
        reviewName: "Abstract Review",
        date: "2024-01-10",
        remarks: "Well structured abstract",
        feedback: "The team has demonstrated excellent understanding of the project scope. The abstract clearly outlines the problem statement, methodology, and expected outcomes.",
        satisfactionLevel: "Excellent",
        type: "incharge"
      },
      {
        id: "i2",
        reviewName: "Final Review",
        date: "2024-03-15",
        remarks: "Outstanding final implementation",
        feedback: "All requirements have been met and exceeded. The system performs exceptionally well under load. Documentation is comprehensive. The team has successfully addressed all previous feedback points.",
        satisfactionLevel: "Excellent",
        type: "incharge"
      }
    ]
  },
  githubLink: "https://github.com/project1",
  driveLink: "https://drive.google.com/project1"
};

const ArchivedProjectDetails = () => {
  const { projectId } = useParams();
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

  // Using static data instead of fetching
  const projectDetails = staticProjectDetails;

  if (!projectDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
          <Link
            to="/Student/ArchivedProjects"
            className="text-[#9b1a31] hover:text-[#82001A]"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/Student/ArchivedProjects"
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
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">
                  {projectDetails.type}
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
              {/* Guide Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Project Guide</h3>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {projectDetails.guide.name}
                      </h4>
                      <p className="text-sm text-gray-500">{projectDetails.guide.department}</p>
                      <p className="text-sm text-gray-600 mt-1">{projectDetails.guide.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Section */}
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
            <div className="space-y-10">
              {/* Guide Reviews Table */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-center">
                  <h3 className="text-2xl font-bold text-gray-900">Guide Reviews</h3>
                </div>
                {projectDetails.reviews.guideReviews.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No guide reviews available yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Review Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detailed Feedback
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Satisfaction Level
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projectDetails.reviews.guideReviews.map((review) => (
                          <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {review.reviewName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{review.date}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {review.remarks || "No remarks provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-md">
                                {review.feedback || "No detailed feedback provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {review.satisfactionLevel ? (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${satisfactionColors[review.satisfactionLevel]}`}>
                                  {review.satisfactionLevel}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Incharge Reviews Table */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-center">
                  <h3 className="text-2xl font-bold text-gray-900">Incharge Reviews</h3>
                </div>
                {projectDetails.reviews.inchargeReviews.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No incharge reviews available yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Review Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detailed Feedback
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Satisfaction Level
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projectDetails.reviews.inchargeReviews.map((review) => (
                          <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {review.reviewName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{review.date}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {review.remarks || "No remarks provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-md">
                                {review.feedback || "No detailed feedback provided"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {review.satisfactionLevel ? (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${satisfactionColors[review.satisfactionLevel]}`}>
                                  {review.satisfactionLevel}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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

export default ArchivedProjectDetails; 
