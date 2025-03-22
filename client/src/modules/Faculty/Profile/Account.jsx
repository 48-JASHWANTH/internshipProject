import React from 'react';
import { useState, useEffect } from "react";
import { FaLock, FaLinkedin, FaGraduationCap, FaUserTie } from "react-icons/fa";
import { Edit, X, Check } from "lucide-react";

import { useStore } from "@/store/useStore";

const Account = ({ handleChangePassword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { profileData, updateSocialLinks } = useStore();
  const [editedLinks, setEditedLinks] = useState(profileData.socialLinks || {
    googleScholar: "",
    vidwan: "",
    linkedin: ""
  });

  // Sync local state with store when profileData changes
  useEffect(() => {
    setEditedLinks(profileData.socialLinks || {
      googleScholar: "",
      vidwan: "",
      linkedin: ""
    });
  }, [profileData.socialLinks]);

  const handleSaveLinks = () => {
    updateSocialLinks(editedLinks);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedLinks(profileData.socialLinks || {
      googleScholar: "",
      vidwan: "",
      linkedin: ""
    });
    setIsEditing(false);
  };

  const handleEditLinks = () => {
    setEditedLinks(profileData.socialLinks || {
      googleScholar: "",
      vidwan: "",
      linkedin: ""
    });
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
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSaveLinks}
                className="flex items-center px-3 py-2 text-xs md:text-sm font-medium text-white bg-[#82001A] rounded-lg hover:bg-[#6b0016]"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            {socialLinkFields.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Icon className="text-gray-500 text-lg md:text-xl mr-3" />
                <a
                  href={profileData.socialLinks?.[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${color} text-sm md:text-base`}
                >
                  {label}
                </a>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
