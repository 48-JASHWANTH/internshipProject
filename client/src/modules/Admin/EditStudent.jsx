import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const EditStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [studentData, setStudentData] = useState({
    name: '',
    department: '',
    batch: '',
    mail: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    linkedInURL: '',
    githubURL: '',
    campus: '',
    tenth: '',
    twelfth: '',
    diploma: '',
    underGraduate: '',
    postGraduate: '',
    currentBacklogs: '',
    backlogsHistory: '',
    interestedInPlacement: '',
    skills: '',
    languages: '',
  });

  // Fetch student data
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await apiClient.get(`/admin/students/${studentId}`, {withCredentials: true});

        if (response.data.success) {
          setStudentData(response.data.student);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await apiClient.put(`/admin/students/${studentId}`, studentData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Student information updated successfully');
        navigate(`/Admin/Students/${studentId}`);
      } else {
        toast.error('Failed to update student information');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error(error.response?.data?.message || 'Error updating student information');
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
            onClick={() => navigate(`/Admin/Students/${studentId}`)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Student Information</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentData.studentID}
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
                  value={studentData.name || ''}
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
                  name="mail"
                  value={studentData.mail || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={studentData.phone || ''}
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
                  value={studentData.department || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <input
                  type="text"
                  name="batch"
                  value={studentData.batch || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={studentData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={studentData.dateOfBirth || ''}
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
                  value={studentData.linkedInURL || ''}
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
                  value={studentData.githubURL || ''}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campus
                </label>
                <input
                  type="text"
                  name="campus"
                  value={studentData.campus || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  10th Grade
                </label>
                <input
                  type="text"
                  name="tenth"
                  value={studentData.tenth || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  12th Grade
                </label>
                <input
                  type="text"
                  name="twelfth"
                  value={studentData.twelfth || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diploma
                </label>
                <input
                  type="text"
                  name="diploma"
                  value={studentData.diploma || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Under Graduate
                </label>
                <input
                  type="text"
                  name="underGraduate"
                  value={studentData.underGraduate || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Graduate
                </label>
                <input
                  type="text"
                  name="postGraduate"
                  value={studentData.postGraduate || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Backlogs
                </label>
                <input
                  type="number"
                  name="currentBacklogs"
                  value={studentData.currentBacklogs || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backlogs History
                </label>
                <textarea
                  name="backlogsHistory"
                  value={studentData.backlogsHistory || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interested In Placement
                </label>
                <select
                  name="interestedInPlacement"
                  value={studentData.interestedInPlacement || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={studentData.skills || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                  placeholder="Comma separated values"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages
                </label>
                <textarea
                  name="languages"
                  value={studentData.languages || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                  placeholder="Comma separated values"
                />
              </div>
            </div>
          </div>

          <div className="p-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/Admin/Students/${studentId}`)}
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

export default EditStudent; 