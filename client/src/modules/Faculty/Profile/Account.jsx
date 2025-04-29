import React from 'react';
import { useState, useEffect } from "react";
import { FaLock, FaLinkedin, FaGraduationCap, FaUserTie } from "react-icons/fa";
import { Edit, X, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
// import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

const Account = ({ handleChangePassword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { profileData, updateProfileData, isLoading, error, fetchProfileData } = useStore();
  const { user } = useStore();
  const [editedLinks, setEditedLinks] = useState({
    googleScholar: "",
    vidwan: "",
    linkedin: ""
  });

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      setEditedLinks({
        googleScholar: profileData.googleScholar || "",
        vidwan: profileData.vidwan || "",
        linkedin: profileData.linkedin || ""
      });
    }
  }, [profileData]);

  const handleSaveLinks = async () => {
    setIsSaving(true);
    
    try {
      // Get faculty ID from user state or profile data
      const facultyId = user?.facultyID || profileData?.empcode;
      
      if (!facultyId) {
        toast.error('Faculty ID not found');
        setIsSaving(false);
        return;
      }
      
      // Map edited links to API format
      const updateData = {
        googleScholarID: editedLinks.googleScholar,
        vidwanID: editedLinks.vidwan,
        linkedInURL: editedLinks.linkedin
      };
      
      // Make API call to update faculty data
      const response = await apiClient.put(
        `faculty/update/${facultyId}`,
        updateData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update local state
        updateProfileData({
          googleScholar: editedLinks.googleScholar,
          vidwan: editedLinks.vidwan,
          linkedin: editedLinks.linkedin
        });
        
        // Refresh profile data from server
        if (fetchProfileData) {
          fetchProfileData(facultyId);
        }
        
        toast.success('Social links updated successfully');
        setIsEditing(false);
      } else {
        toast.error(response.data.message || 'Failed to update social links');
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating social links');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profileData) {
      setEditedLinks({
        googleScholar: profileData.googleScholar || "",
        vidwan: profileData.vidwan || "",
        linkedin: profileData.linkedin || ""
      });
    } else {
      setEditedLinks({
        googleScholar: "",
        vidwan: "",
        linkedin: ""
      });
    }
    setIsEditing(false);
  };

  const handleEditLinks = () => {
    if (profileData) {
      setEditedLinks({
        googleScholar: profileData.googleScholar || "",
        vidwan: profileData.vidwan || "",
        linkedin: profileData.linkedin || ""
      });
    }
    setIsEditing(true);
  };

  const handleLinkChange = (key, value) => {
    setEditedLinks(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const socialLinkFields = [
    {
      key: 'googleScholar',
      label: 'Google Scholar',
      icon: FaGraduationCap,
      color: 'text-blue-700'
    },
    {
      key: 'vidwan',
      label: 'Vidwan',
      icon: FaUserTie,
      color: 'text-green-700'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: FaLinkedin,
      color: 'text-blue-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="mt-4 px-2 md:px-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#82001A]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 px-2 md:px-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>Error loading account data: {error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="mt-4 px-2 md:px-4">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          <p>No account data available. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 px-2 md:px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold">Account & Settings</h2>
        {!isEditing && (
          <button 
            onClick={handleEditLinks}
            className="flex items-center px-3 py-2 text-sm text-[#82001A] hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Links
          </button>
        )}
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <FaLock className="text-gray-500 text-lg md:text-xl mr-3" />
          <button onClick={handleChangePassword} className="text-[#82001A] text-sm md:text-base">
            Change Password
          </button>
        </div>
        
        {isEditing ? (
          <>
            {socialLinkFields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Icon className="text-gray-500 text-lg md:text-xl mr-3" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <input
                  type="url"
                  value={editedLinks[key] || ''}
                  onChange={(e) => handleLinkChange(key, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${label} profile URL`}
                />
              </div>
            ))}
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCancelEdit}
                className="flex items-center px-3 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSaveLinks}
                className="flex items-center px-3 py-2 text-xs md:text-sm font-medium text-white bg-[#82001A] rounded-lg hover:bg-[#6b0016] disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {socialLinkFields.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Icon className="text-gray-500 text-lg md:text-xl mr-3" />
                {profileData[key] ? (
                  <a
                    href={profileData[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${color} text-sm md:text-base`}
                  >
                    {label}
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm md:text-base">
                    No {label} profile linked
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
