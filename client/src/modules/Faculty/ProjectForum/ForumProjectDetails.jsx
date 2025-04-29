import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { Loader2, ArrowLeft, Tag, Users, Calendar, CheckCircle, XCircle, Award, BookOpen, Layers, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';

const statusColors = {
  'Open': 'bg-green-100 text-green-800 border-green-200',
  'Close': 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  'Open': <CheckCircle className="w-5 h-5 mr-2" />,
  'Close': <XCircle className="w-5 h-5 mr-2" />
};

const ForumProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useStore();
  const [facultyData, setFacultyData] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `forum-projects/project/${projectId}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setProject(response.data.project);
        } else {
          toast.error(response.data.message || 'Failed to fetch project details');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast.error(error.response?.data?.message || 'An error occurred while fetching project details');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  useEffect(() => {
    if (project?.facultyId) {
      fetchFacultyData(project.facultyId);
    }
  }, [project]);

  const fetchFacultyData = async (facultyId) => {
    try {
      const response = await apiClient.get(
        `faculty/${facultyId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setFacultyData(response.data.faculty);
      }
    } catch (error) {
      console.error('Error fetching faculty details:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#82001A] mb-4" />
          <p className="text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center">
            <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">Project not found</p>
            <button
              onClick={() => navigate('/Faculty/ProjectForum')}
              className="px-6 py-3 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition shadow-md flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate('/Faculty/ProjectForum')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#82001A] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{project.Title}</h1>
                <div className={`px-4 py-2 rounded-full font-medium flex items-center border ${
                  statusColors[project.Status]
                }`}>
                  {statusIcons[project.Status]}
                  {project.Status}
                </div>
              </div>
              
              <div className="prose max-w-none text-gray-600">
                <p className="text-lg">{project.Description}</p>
              </div>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-[#82001A]" />
                <h2 className="text-xl font-semibold text-gray-800">Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.TechStack?.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Interested Students */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#82001A]" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Interested Students 
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({project.InterestedStudents?.length || 0})
                  </span>
                </h2>
              </div>
              
              {project.InterestedStudents?.length > 0 ? (
                <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Branch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {project.InterestedStudents.map((student) => (
                        <tr key={student.studentID} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.studentID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.branch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.mail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(student.date), 'MMM dd, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No students have expressed interest yet.</p>
                  {project.Status === 'Close' && (
                    <p className="text-gray-400 text-sm mt-2">The project is currently closed for new interests.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar - Right Column */}
        <div className="space-y-8">
          {/* Project Info Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#82001A]" />
                Project Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Domain</span>
                  <span className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                    <Tag className="w-4 h-4 text-[#82001A]" />
                    {project.Domain}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Faculty</span>
                  <span className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                    <Award className="w-4 h-4 text-[#82001A]" />
                    {facultyData ? facultyData.name : project.facultyId}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Created On</span>
                  <span className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-[#82001A]" />
                    {format(new Date(project.createdAt), 'MMMM dd, yyyy')}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Project ID</span>
                  <span className="text-gray-800 font-medium mt-1 text-sm">
                    {project.projectId}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Card */}
          <div className={`rounded-xl shadow-sm overflow-hidden border ${
            project.Status === 'Open' 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {project.Status === 'Open' 
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <XCircle className="w-5 h-5 text-red-600" />
                }
                Project Status
              </h2>
              
              <p className={`text-sm ${
                project.Status === 'Open' 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }`}>
                {project.Status === 'Open' 
                  ? 'This project is currently open for student interest.' 
                  : 'This project is currently closed for new interests.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumProjectDetails; 