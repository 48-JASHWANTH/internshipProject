import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    regNumber: '',
    mail: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    profilePic: ''
  });
  const [editedData, setEditedData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Get student ID from localStorage or context
  const authData = localStorage.getItem('auth-storage');
  const studentID = JSON.parse(authData).state.user.studentID; // Fallback for testing
  const { studentData, loading, error, fetchStudentData ,setLoading} = useStore();
  


  useEffect(() => {
    if(!studentData){
      console.log("from personal")
      fetchStudentData(studentID);
    }
  }, [fetchStudentData,studentID]);
  useEffect(()=>{
    if(studentData){
      setProfileInfo(studentData.personal);
      setEditedData(studentData.personal)
    }
    
  },[studentData])



  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setEditedData({ ...editedData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare data for the API
      const updateData = {
        name: editedData.name,
        mail: editedData.mail,
        phone: editedData.phone,
        gender: editedData.gender,
        dateOfBirth: editedData.dateOfBirth
      };
      
      const response = await apiClient.put(
        `student/personal/${studentID}`, 
        updateData,{withCredentials:true}
      );
      
      if (response.status === 200) {
        toast.success('Profile information updated successfully');
        
        // Update the profile data with the response
        setProfileInfo({
          name: response.data.name || '',
          regNumber: response.data.studentID || '',
          mail: response.data.mail || '',
          phone: response.data.phone || '',
          gender: response.data.gender || '',
          dateOfBirth: response.data.dateOfBirth || '',
          profilePic: selectedFile || profileInfo.profilePic
        });
        
        // TODO: Handle profile picture upload separately if needed
      }
    } catch (err) {
      console.error('Error updating profile data:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile information');
    } finally {
      setLoading(false);
      setIsEditing(false);
      setSelectedFile(null);
    }
  };

  if (loading && !profileInfo.name) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4 mb-6"></div>
          
          <div className="w-full space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 gap-4 w-full">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="p-4 md:p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200 mb-3">
            <img 
              src={profileInfo.profilePic || "../../assets/profilepic.png"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800">{profileInfo.name}</h3>
          <span className="text-sm text-orange-400">Published</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base md:text-lg font-semibold text-gray-800">Personal Information</h4>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-[#82001A] hover:text-[#6b0016] transition-colors duration-200"
            aria-label="Edit personal information"
          >
            <Edit className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {[
            { label: "Name", value: profileInfo.name },
            { label: "Registration Number", value: studentID },
            { label: "Email", value: profileInfo.mail },
            { label: "Phone", value: profileInfo.phone },
            { label: "Gender", value: profileInfo.gender },
            { label: "Date of Birth", value: profileInfo.dateOfBirth ? new Date(profileInfo.dateOfBirth).toLocaleDateString('en-GB') : '' }
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <label className="block text-xs md:text-sm text-gray-600">{label}</label>
              <div className="text-xs md:text-sm font-medium text-gray-800 break-words">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Personal Information</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Update your photo and personal details here</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveChanges} className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedFile || editedData.profilePic || "../../assets/profilepic.png"} 
                  alt="Profile" 
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover"
                />
                <label className="px-3 py-2 text-xs md:text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-600 transition-colors duration-200 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  Upload    
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    value={editedData.name ? editedData.name.split(' ')[0] : ''}
                    onChange={(e) => {
                      const lastName = editedData.name ? editedData.name.split(' ').slice(1).join(' ') : '';
                      setEditedData({ ...editedData, name: `${e.target.value} ${lastName}` });
                    }}
                  />

                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    value={editedData.name ? editedData.name.split(' ').slice(1).join(' ') : ''}
                    onChange={(e) => {
                      const firstName = editedData.name ? editedData.name.split(' ')[0] : '';
                      setEditedData({ ...editedData, name: `${firstName} ${e.target.value}` });
                    }}
                  />

                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  {['Male', 'Female'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={editedData.gender === option}
                        onChange={(e) => setEditedData({ ...editedData, gender: e.target.value })}
                        className="w-4 h-4 text-[#82001A] focus:ring-[#82001A] border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  value={editedData.mail}
                  onChange={(e) => setEditedData({ ...editedData, mail: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Phone No <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select className="w-20 border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400">
                    <option>+91</option>
                  </select>
                  <input
                    type="tel"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    value={editedData.phone ? editedData.phone.replace('+91 ', '') : ''}

                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value.startsWith('+91 ') ? e.target.value : '+91 ' + e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    value={editedData.dateOfBirth}
                    onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    value={studentID}
                    readOnly
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
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
