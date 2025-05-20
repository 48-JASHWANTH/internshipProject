import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const EditFaculty = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [facultyData, setFacultyData] = useState({
    name: '',
    department: '',
    designation: '',
    email: '',
    phoneNumber: '',
    jntuhId: '',
    dob: '',
    linkedInURL: '',
    githubURL: '',
    qualification: '',
    workLocation: '',
    manager1: '',
    manager2: '',
    employmentType: '',
    teachType: '',
    shift: '',
    joiningDate: '',
    alternateEmail: '',
    emergencyContact: '',
    googleScholarID: '',
    vidwanID: '',
  });

  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        const response = await apiClient.get(`/admin/faculty/${facultyId}`, {withCredentials: true});

        if (response.data.success) {
          setFacultyData(response.data.faculty);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await apiClient.put(`/admin/faculty/${facultyId}`, facultyData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Faculty information updated successfully');
        navigate(`/Admin/Faculty/${facultyId}`);
      } else {
        toast.error('Failed to update faculty information');
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      toast.error(error.response?.data?.message || 'Error updating faculty information');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(`/Admin/Faculty/${facultyId}`)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Faculty Information</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty ID
                </label>
                <input
                  type="text"
                  value={facultyData.facultyID}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={facultyData.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={facultyData.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={facultyData.phoneNumber || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={facultyData.department || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={facultyData.designation || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  JNTUH ID
                </label>
                <input
                  type="text"
                  name="jntuhId"
                  value={facultyData.jntuhId || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={facultyData.dob || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedInURL"
                  value={facultyData.linkedInURL || ''}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubURL"
                  value={facultyData.githubURL || ''}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={facultyData.qualification || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Location
                </label>
                <input
                  type="text"
                  name="workLocation"
                  value={facultyData.workLocation || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager 1
                </label>
                <input
                  type="text"
                  name="manager1"
                  value={facultyData.manager1 || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager 2
                </label>
                <input
                  type="text"
                  name="manager2"
                  value={facultyData.manager2 || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <input
                  type="text"
                  name="employmentType"
                  value={facultyData.employmentType || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teach Type
                </label>
                <input
                  type="text"
                  name="teachType"
                  value={facultyData.teachType || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift
                </label>
                <input
                  type="text"
                  name="shift"
                  value={facultyData.shift || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={facultyData.joiningDate || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Email
                </label>
                <input
                  type="email"
                  name="alternateEmail"
                  value={facultyData.alternateEmail || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={facultyData.emergencyContact || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Scholar ID
                </label>
                <input
                  type="text"
                  name="googleScholarID"
                  value={facultyData.googleScholarID || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vidwan ID
                </label>
                <input
                  type="text"
                  name="vidwanID"
                  value={facultyData.vidwanID || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/Admin/Faculty/${facultyId}`)}
              className="px-4 py-2 text-gray-700 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#9b1a31] text-white rounded-md flex items-center gap-2 hover:bg-[#7b1426] transition-colors disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFaculty; 