import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store/useStore';

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { profileData, updateProfileData, isLoading, error, fetchProfileData } = useStore();
  const { user } = useStore();
  
  // Get faculty ID from user state
  const facultyID = user?.facultyID;
  
  // Initialize edited data from profile data
  const [editedData, setEditedData] = useState({
    name: '',
    regNumber: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    profilePic: ''
  });
  
  // Fetch profile data on component mount
  useEffect(() => {
    if (facultyID && fetchProfileData) {
      fetchProfileData(facultyID);
    }
  }, [facultyID, fetchProfileData]);
  
  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      setEditedData({
        name: profileData.empname || '',
        regNumber: profileData.empcode || '',
        email: profileData.email || '',
        phone: profileData.contactNumber || '',
        gender: profileData.gender || '',
        dateOfBirth: profileData.dateOfBirth || '',
        profilePic: profileData.profilePic || ''
      });
    }
  }, [profileData]);

  const handleSaveChanges = async () => {
    if (!facultyID) {
      toast.error('Faculty ID not found');
      return;
    }

    setIsSaving(true);

    try {
      // Map edited data to API format
      const updateData = {
        name: editedData.name,
        facultyID: editedData.regNumber,
        email: editedData.email,
        phoneNumber: editedData.phone,
        gender: editedData.gender,
        dob: editedData.dateOfBirth,
        profilePic: editedData.profilePic // Include the profile pic URL directly
      };

      // Update faculty data with a single request
      const response = await axios.put(
        `http://localhost:1544/faculty/update/${facultyID}`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Map API response to profile data format
        const updatedProfileData = {
          empname: updateData.name,
          empcode: updateData.facultyID,
          email: updateData.email,
          contactNumber: updateData.phoneNumber,
          gender: updateData.gender,
          dateOfBirth: updateData.dob,
          profilePic: updateData.profilePic
        };
        
        // Update local state
        updateProfileData(updatedProfileData);
        
        // Refresh profile data from server
        fetchProfileData(facultyID);
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setSelectedFile(null);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Convert the file to a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedData(prev => ({
          ...prev,
          profilePic: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-red-900 to-yellow-400"></div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#82001A] mt-8 mb-8"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-red-900 to-yellow-400"></div>
        <div className="p-6">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p>Error loading profile data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-red-900 to-yellow-400"></div>
        <div className="p-6">
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
            <p>No profile data available. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-red-900 to-yellow-400"></div>
      
      {/* Profile Picture */}
      <div className="flex justify-center">
        <div className="relative -mt-16">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            {editedData.profilePic ? (
              <img 
                src={editedData.profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-4xl">👤</span>
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="absolute bottom-0 right-0">
              <label 
                htmlFor="profile-pic-upload" 
                className="w-8 h-8 flex items-center justify-center bg-[#82001A] text-white rounded-full cursor-pointer shadow-md"
              >
                <Edit className="w-4 h-4" />
              </label>
              <input 
                id="profile-pic-upload"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="pt-16 pb-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Profile Info</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#82001A] hover:text-[#9b1a31]"
            >
              <Edit className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {Object.entries({
            Name: 'name',
            'Faculty ID': 'regNumber',
            Email: 'email',
            Phone: 'phone',
            Gender: 'gender',
            'Date of Birth': 'dateOfBirth'
          }).map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600">
                {label}
              </label>
              {isEditing ? (
                <input
                  type={key === 'dateOfBirth' ? 'date' : 'text'}
                  value={editedData[key] || ''}
                  onChange={(e) =>
                    setEditedData(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9b1a31] focus:ring focus:ring-[#9b1a31] focus:ring-opacity-50"
                />
              ) : (
                <p className="mt-1 text-gray-900">{editedData[key] || 'Not specified'}</p>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-4 py-2 bg-[#82001A] text-white rounded-md hover:bg-[#9b1a31] disabled:opacity-50 flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
