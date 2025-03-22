import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStore } from '@/store/useStore';

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    regNumber: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    profilePic: ''
  });
  const [editedData, setEditedData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateProfileData = useStore(state => state.updateProfileData);
  const user = useStore(state => state.user);

  // Get faculty ID from user state
  const facultyID = user?.facultyID;

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!facultyID) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:1544/faculty/personal/${facultyID}`);
        
        // Map the response data to our component state
        const data = {
          name: response.data.name || '',
          regNumber: response.data.facultyID || '',
          email: response.data.mail || '',
          phone: response.data.phone || '',
          gender: response.data.gender || '',
          dateOfBirth: response.data.dateOfBirth || '',
          profilePic: response.data.profilePic || ''
        };
        
        setProfileInfo(data);
        setEditedData(data);
        updateProfileData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile information. Please try again later.');
        toast.error('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [facultyID, updateProfileData]);

  const handleSaveChanges = async () => {
    if (!facultyID) return;

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append all edited data
      Object.keys(editedData).forEach(key => {
        if (key !== 'profilePic') {
          formData.append(key, editedData[key]);
        }
      });

      // Append profile picture if selected
      if (selectedFile) {
        formData.append('profilePic', selectedFile);
      }

      const response = await axios.put(
        `http://localhost:1544/faculty/personal/${facultyID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setProfileInfo(editedData);
        updateProfileData(editedData);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setEditedData(prev => ({
        ...prev,
        profilePic: URL.createObjectURL(file)
      }));
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Profile Picture Section */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-red-900 to-yellow-400" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            {isEditing ? (
              <label className="cursor-pointer w-full h-full flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Edit className="w-6 h-6 text-gray-600" />
              </label>
            ) : (
              editedData.profilePic ? (
                <img
                  src={editedData.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl text-gray-400">👤</span>
                </div>
              )
            )}
          </div>
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
                <p className="mt-1 text-gray-900">{profileInfo[key] || '-'}</p>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="px-4 py-2 bg-[#82001A] text-white rounded-md hover:bg-[#9b1a31] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
