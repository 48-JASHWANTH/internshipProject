import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const StudentView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await apiClient.get(`/admin/students/${studentId}`, {withCredentials: true});

        if (response.data.success) {
          setStudent(response.data.student);
        } else {
          toast.error('Failed to fetch student details');
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        toast.error('Error fetching student details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/Admin/Students')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Student Information</h1>
        </div>
        
        <button 
          onClick={() => navigate(`/Admin/EditStudent/${studentId}`)}
          className="bg-[#9b1a31] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#7b1426] transition-colors"
        >
          <FaEdit /> Edit Student
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 bg-[#9b1a31] text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-white text-[#9b1a31] flex items-center justify-center text-2xl font-bold">
              {student?.name?.charAt(0)}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{student?.name}</h2>
              <p className="text-white/80">{student?.studentID}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex">
            {['basic', 'academic', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-[#9b1a31] text-[#9b1a31]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
              </button>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Student ID</label>
                  <p className="mt-1 text-gray-900">{student?.studentID}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-gray-900">{student?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900">{student?.mail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-gray-900">{student?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="mt-1 text-gray-900">{student?.gender || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="mt-1 text-gray-900">{student?.dateOfBirth || 'Not provided'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">LinkedIn URL</label>
                  <p className="mt-1 text-gray-900">
                    {student?.linkedInURL ? (
                      <a href={student.linkedInURL} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        {student.linkedInURL}
                      </a>
                    ) : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">GitHub URL</label>
                  <p className="mt-1 text-gray-900">
                    {student?.githubURL ? (
                      <a href={student.githubURL} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:underline">
                        {student.githubURL}
                      </a>
                    ) : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Campus</label>
                  <p className="mt-1 text-gray-900">{student?.campus || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-gray-900">{student?.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Batch</label>
                  <p className="mt-1 text-gray-900">{student?.batch}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      student?.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Academic Info Tab */}
          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">10th Grade</label>
                  <p className="mt-1 text-gray-900">{student?.tenth || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">12th Grade</label>
                  <p className="mt-1 text-gray-900">{student?.twelfth || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Diploma</label>
                  <p className="mt-1 text-gray-900">{student?.diploma || 'NA'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Under Graduate</label>
                  <p className="mt-1 text-gray-900">{student?.underGraduate || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Post Graduate</label>
                  <p className="mt-1 text-gray-900">{student?.postGraduate || 'NA'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Backlogs</label>
                  <p className="mt-1 text-gray-900">{student?.currentBacklogs || '0'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Backlogs History</label>
                  <p className="mt-1 text-gray-900">{student?.backlogsHistory || 'No history'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Interested In Placement</label>
                  <p className="mt-1 text-gray-900">{student?.interestedInPlacement || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Skills</label>
                  <p className="mt-1 text-gray-900">{student?.skills || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Languages</label>
                  <p className="mt-1 text-gray-900">{student?.languages || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Documents Info Tab - Empty */}
          {activeTab === 'documents' && (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500 italic">No documents available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentView; 