import React, { useState } from "react";
import { FaSearch, FaFilter, FaComment, FaThumbsUp, FaEye, FaPlus } from "react-icons/fa";

const ProjectForum = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  
  const discussions = [
    {
      id: 1,
      title: "Best practices for guiding final year projects",
      author: "Dr. Sarah Johnson",
      department: "Computer Science",
      date: "2 days ago",
      comments: 15,
      likes: 24,
      views: 142,
    },
    {
      id: 2,
      title: "Integrating industry requirements into student projects",
      author: "Dr. Michael Chen",
      department: "Information Technology",
      date: "1 week ago",
      comments: 8,
      likes: 19,
      views: 87,
    },
    {
      id: 3,
      title: "Tools for remote project collaboration",
      author: "Dr. Emily Wilson",
      department: "Electrical Engineering",
      date: "2 weeks ago",
      comments: 22,
      likes: 35,
      views: 203,
    },
    {
      id: 4,
      title: "Evaluating project innovation and creativity",
      author: "Dr. Robert Brown",
      department: "Mechanical Engineering",
      date: "3 weeks ago",
      comments: 12,
      likes: 28,
      views: 156,
    },
  ];
  
  const resources = [
    {
      id: 1,
      title: "Project Management Templates",
      author: "Dr. James Martinez",
      type: "Document",
      date: "January 15, 2023",
      downloads: 87,
    },
    {
      id: 2,
      title: "Research Methodology Workshop Recording",
      author: "Dr. Lisa Thompson",
      type: "Video",
      date: "March 10, 2023",
      downloads: 64,
    },
    {
      id: 3,
      title: "Technical Writing Guidelines",
      author: "Dr. David Wilson",
      type: "PDF",
      date: "February 5, 2023",
      downloads: 112,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Forum</h1>
        
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search forum..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82001A] focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <FaFilter />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015]">
            <FaPlus />
            <span>New Post</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "discussions"
                ? "border-b-2 border-[#82001A] text-[#82001A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("discussions")}
          >
            Discussions
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "resources"
                ? "border-b-2 border-[#82001A] text-[#82001A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
        </div>
      </div>
      
      {activeTab === "discussions" && (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold text-[#82001A] mb-2">{discussion.title}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>{discussion.author}</span>
                <span className="mx-2">•</span>
                <span>{discussion.department}</span>
                <span className="mx-2">•</span>
                <span>{discussion.date}</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FaComment className="text-gray-400" />
                  <span>{discussion.comments} Comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaThumbsUp className="text-gray-400" />
                  <span>{discussion.likes} Likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEye className="text-gray-400" />
                  <span>{discussion.views} Views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === "resources" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold border-b">
            <div className="col-span-5">Resource Title</div>
            <div className="col-span-2">Author</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Date Added</div>
            <div className="col-span-1">Actions</div>
          </div>
          
          {resources.map((resource) => (
            <div key={resource.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50">
              <div className="col-span-5 font-medium">{resource.title}</div>
              <div className="col-span-2">{resource.author}</div>
              <div className="col-span-2">{resource.type}</div>
              <div className="col-span-2">{resource.date}</div>
              <div className="col-span-1">
                <button className="text-blue-600 hover:text-blue-800">Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectForum; 