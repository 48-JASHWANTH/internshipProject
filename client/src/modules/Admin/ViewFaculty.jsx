import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const ViewFaculty = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        const response = await apiClient.get(`/admin/faculty/${facultyId}`, {withCredentials: true});

        if (response.data.success) {
          setFaculty(response.data.faculty);
        } else {
          toast.error('Failed to fetch faculty details');
        }
      } catch (error) {
        console.error('Error fetching faculty details:', error);
        toast.error('Error fetching faculty details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacultyDetails();
  }, [facultyId]);

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
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/Admin/Faculty')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Faculty Information</h1>
      </div>

      {/* Faculty Profile Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 bg-[#9b1a31] text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-white text-[#9b1a31] flex items-center justify-center text-2xl font-bold">
              {faculty?.name?.charAt(0)}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{faculty?.name}</h2>
              <p className="text-white/80">{faculty?.facultyID}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex">
            {['basic', 'additional'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-[#9b1a31] text-[#9b1a31]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'basic' ? 'Basic Info' : 'Additional Info'}
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
                  <label className="text-sm font-medium text-gray-500">Faculty ID</label>
                  <p className="mt-1 text-gray-900">{faculty?.facultyID}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-gray-900">{faculty?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">JNTUH ID</label>
                  <p className="mt-1 text-gray-900">{faculty?.jntuhId || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-gray-900">{faculty?.department || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Designation</label>
                  <p className="mt-1 text-gray-900">{faculty?.designation || 'Not provided'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900">{faculty?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="mt-1 text-gray-900">{faculty?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">LinkedIn URL</label>
                  <p className="mt-1 text-gray-900">
                    {faculty?.linkedInURL ? (
                      <a href={faculty.linkedInURL} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        {faculty.linkedInURL}
                      </a>
                    ) : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">GitHub URL</label>
                  <p className="mt-1 text-gray-900">
                    {faculty?.githubURL ? (
                      <a href={faculty.githubURL} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:underline">
                        {faculty.githubURL}
                      </a>
                    ) : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="mt-1 text-gray-900">{faculty?.dob || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info Tab */}
          {activeTab === 'additional' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Work Location</label>
                  <p className="mt-1 text-gray-900">{faculty?.workLocation || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Manager 1</label>
                  <p className="mt-1 text-gray-900">{faculty?.manager1 || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Manager 2</label>
                  <p className="mt-1 text-gray-900">{faculty?.manager2 || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="mt-1 text-gray-900">{faculty?.employmentType || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teach Type</label>
                  <p className="mt-1 text-gray-900">{faculty?.teachType || 'Not provided'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Shift</label>
                  <p className="mt-1 text-gray-900">{faculty?.shift || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      !faculty?.softDeleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {!faculty?.softDeleted ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Joining Date</label>
                  <p className="mt-1 text-gray-900">{faculty?.joiningDate || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Qualification</label>
                  <p className="mt-1 text-gray-900">{faculty?.qualification || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Alternate Email</label>
                  <p className="mt-1 text-gray-900">{faculty?.alternateEmail || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                  <p className="mt-1 text-gray-900">{faculty?.emergencyContact || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Google Scholar ID</label>
                  <p className="mt-1 text-gray-900">{faculty?.googleScholarID || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vidwan ID</label>
                  <p className="mt-1 text-gray-900">{faculty?.vidwanID || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFaculty; 