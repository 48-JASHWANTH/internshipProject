import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'Closed': 'bg-red-100 text-red-800'
};

const ProjectForumDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { currentUser } = useStore();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/forum-projects/project/${projectId}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setProjectData(response.data.project);
          
          // Check if the current user has already expressed interest
          const isInterested = response.data.project.InterestedStudents?.some(
            student => student.studentID === currentUser?.studentID
          );
          setHasExpressedInterest(isInterested);
        } else {
          setError(response.data.message || "Failed to fetch project details");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError(error.response?.data?.message || "Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId, currentUser?.studentID]);

  const handleExpressInterest = async () => {
    try {
      const studentData = {
        studentID: currentUser?.studentID || "",
        name: currentUser?.name || "",
        branch: currentUser?.department || "",
        mail: currentUser?.email || ""
      };

      const response = await apiClient.post(
        `/forum-projects/${projectId}/express-interest`,
        studentData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Interest expressed successfully!");
        setHasExpressedInterest(true);
      } else {
        toast.error(response.data.message || "Failed to express interest");
      }
    } catch (error) {
      console.error("Error expressing interest:", error);
      toast.error(error.response?.data?.message || "Failed to express interest");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#82001A]"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="max-w-4xl mx-auto p-6">
  //       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
  //         <strong className="font-bold">Error: </strong>
  //         <span className="block sm:inline">{error}</span>
  //       </div>
  //       <button 
  //         onClick={() => navigate(-1)}
  //         className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
  //       >
  //         Go Back
  //       </button>
  //     </div>
  //   );
  // }

  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found: </strong>
          <span className="block sm:inline">Project not found</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-black">Project Details</h1>
      </div>

      {/* Project Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-6">
          {/* Title and Status */}
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-black">{projectData.Title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[projectData.Status]}`}>
              {projectData.Status}
            </span>
          </div>

          {/* Domain */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Domain</h3>
            <p className="text-gray-800">{projectData.Domain}</p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {projectData.TechStack?.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{projectData.Description}</p>
          </div>
        </div>
      </div>

      {/* Faculty Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Faculty Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 text-sm">Faculty ID:</span>
              <p className="font-medium text-gray-800">{projectData.facultyId}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Faculty Name:</span>
              <p className="font-medium text-gray-800">{projectData.facultyName}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Faculty Email:</span>
              <p className="font-medium text-[#82001A]">{projectData.facultyEmail}</p>
            </div>
          </div>
          
          {/* Interest Status */}
          {/* <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Interest Status</h3>
            {hasExpressedInterest ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Interested: </strong>
                <span className="block sm:inline">You have already expressed interest in this project.</span>
              </div>
            ) : projectData.Status === "Open" ? (
              <button
                onClick={handleExpressInterest}
                className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition-colors"
              >
                Express Interest
              </button>
            ) : (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Closed: </strong>
                <span className="block sm:inline">This project is no longer accepting new interests.</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectForumDetails; 