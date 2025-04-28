import React, { useState, useEffect } from 'react';
import {useStore} from '@/store/useStore';
import { FaLock, FaGithub, FaLinkedin } from "react-icons/fa";
import { Edit, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

const Account = ({ handleChangePassword }) => {
  const { user, setLoading, studentData, fetchStudentData } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: ""
  });

  // Fetch student data when component mounts
  useEffect(() => {
    if (user && !studentData) {
      fetchStudentData(user.studentID);
    }
  }, [user, studentData, fetchStudentData]);

  // Update socialLinks when studentData changes
  useEffect(() => {
    if (studentData) {
      setSocialLinks({
        github: studentData.personal?.github || "",
        linkedin: studentData.personal?.linkedin || ""
      });
    }
  }, [studentData]);

  const handleSaveLinks = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Validate URLs
      if (socialLinks.github && !isValidUrl(socialLinks.github)) {
        toast.error('Please enter a valid GitHub URL');
        return;
      }
      
      if (socialLinks.linkedin && !isValidUrl(socialLinks.linkedin)) {
        toast.error('Please enter a valid LinkedIn URL');
        return;
      }
      
      // Call the API endpoint following same pattern as other student endpoints
      const response = await apiClient.put(
        `/student/social/${user.studentID}`, 
        socialLinks,
        {withCredentials: true}
      );
      
      if (response.data.success) {
        toast.success('Social links updated successfully');
        setIsEditing(false);
        // Refresh student data
        fetchStudentData(user.studentID);
      } else {
        toast.error(response.data.message || 'Failed to update social links');
      }
    } catch (err) {
      console.error('Error updating social links:', err);
      toast.error(err.response?.data?.message || 'Failed to update social links');
    } finally {
      setLoading(false);
    }
  };
  
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="mt-4 px-2 md:px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold">Account & Settings</h2>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-[#82001A] hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          Edit 
        </button>
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <FaLock className="text-gray-500 text-lg md:text-xl mr-3" />
          <button onClick={handleChangePassword} className="text-[#82001A] text-sm md:text-base">
            Change Password
          </button>
        </div>
        <div className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <FaGithub className="text-gray-500 text-lg md:text-xl mr-3" />
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-sm md:text-base"
          >
            GitHub
          </a>
        </div>
        <div className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <FaLinkedin className="text-gray-500 text-lg md:text-xl mr-3" />
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm md:text-base"
          >
            LinkedIn
          </a>
        </div>
      </div>
      
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">Edit Social Links</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Update your social media profiles</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveLinks} className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Profile URL
                </label>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-l-lg border border-gray-300 border-r-0">
                    <FaGithub className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={socialLinks.github}
                    onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile URL
                </label>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-l-lg border border-gray-300 border-r-0">
                    <FaLinkedin className="text-blue-600" />
                  </div>
                  <input
                    type="url"
                    className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-3 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs md:text-sm font-medium text-white bg-[#82001A] rounded-lg hover:bg-[#6b0016]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
